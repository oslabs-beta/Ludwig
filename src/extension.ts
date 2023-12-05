import * as vscode from 'vscode';
import * as path from 'path';
const { compileLogic } = require('./logicCompiler.ts');

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "ludwig" is now active!');

    // Map to track highlighted HTML elements and their positions
    const highlightedElements = new Map<string, vscode.Range[]>();

    // Create decoration type outside of the function
    const decorationType = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        overviewRulerColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
    });

    let isExtensionActive = true;

    // Function to highlight lines based on anchors without aria-label
    async function highlightElements(document: vscode.TextDocument) {
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
            const highlightedRanges: vscode.Range[] = [];
            const highlightedLines = new Set<number>();

            // invoke compileLogic to get object with ARIA recommendations
            const ariaRecommendations = await compileLogic();
            const elementsToHighlight = Object.keys(ariaRecommendations);

            // Loop through each line in the document
            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
                const line = document.lineAt(lineNumber);

                // Check if the line's content matches any element to highlight
                const key = line.text.trim();
                if (elementsToHighlight.includes(key) && !highlightedLines.has(lineNumber)) {
                    // Create a range for the entire line
                    const lineRange = new vscode.Range(line.range.start, line.range.end);
                    highlightedRanges.push(lineRange);
                    highlightedLines.add(lineNumber);
                }
            }

            // Clear existing decorations before applying new ones - prevents red from getting brighter and brighter
            activeEditor.setDecorations(decorationType, []);

            // Apply red background thing to highlight the lines
            activeEditor.setDecorations(decorationType, highlightedRanges);

            // Store the highlighted ranges in the map for hover stuff later
            highlightedElements.set('ariaRecommendations', highlightedRanges);
        }
    }


    // Register onDidChangeTextDocument event to trigger highlighting when the document changes
    let documentChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'html') {
            if(isExtensionActive){
                highlightElements(event.document);
            }
        }
    });

    // Register onDidChangeActiveTextEditor event to trigger highlighting when the active editor changes
    let activeEditorChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === 'html') {
            if(isExtensionActive){
                highlightElements(editor.document);
            }
        }
    });

    // Command to trigger the highlighting functionality
    let highlightCommandDisposable = vscode.commands.registerCommand('ludwig.highlightElements', () => {
        if(!isExtensionActive) {
            isExtensionActive = true;
        }
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.languageId === 'html') {
            const document = activeEditor.document;
            if(isExtensionActive){
                highlightElements(document);
            }
        }
    });

    let toggleOffCommandDisposable = vscode.commands.registerCommand('ludwig.toggleOff', () => {
        if(isExtensionActive) {
            isExtensionActive = false;
        }
        const activeEditor = vscode.window.activeTextEditor;
        activeEditor?.setDecorations(decorationType, []);
    });

    // Register onDidOpenTextDocument event to immediately highlight elements when an HTML file is opened
    let documentOpenDisposable = vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
        if (document.languageId === 'html') {
            if(isExtensionActive){
                highlightElements(document);
            }
        }
    });

    // Hover provider to show a popup window with ARIA recommendations
    let hoverProviderDisposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'html' }, {
        provideHover(document, position, token) {
            //is a vscode.Range (which is an obj) of whatever word that the cursor is currently positioned over. Range auto separates by spaces.
            const wordRange = document.getWordRangeAtPosition(position); 

            if (wordRange) { //checks if the cursor is currently on a word or letter
                const hoveredWord = document.getText(wordRange); //gets only the text of current word being hovered over
                // console.log('HOVERED WORD :', hoveredWord);
                const hoveredLine = document.lineAt(wordRange.start.line); //is an object that has the line of the hovered word
                const hoveredLineText = hoveredLine.text.trim(); //extracts the full line of the hovered text from hoveredLine
                // console.log('HOVERED LINE :',hoveredLineText);

                //is an array where each element is a vscode.Range Object representing the range of the highlighted line
                const highlightedRanges = highlightedElements.get('ariaRecommendations'); 
                
                //checks if at least 1 of the  highlighted ranges completely contains the range of the currently hovered word, if so display popup
                if (highlightedRanges && highlightedRanges.some((range) => range.contains(wordRange))) {
                    for (const range of highlightedRanges){ 
                        const lineText = document.getText(range).trim(); //get the current highlighted line text
                        
                        if(lineText === hoveredLineText) { //checks if the highlighted line matches hovered word line
                            // console.log('highlighted line:', lineText);

                            return compileLogic()//gets an recommendation object with {key= each element that failed, value =  associated recommendation object(?)}
                                .then((ariaRecommendations : {[key: string]: any}) => {
                                    // console.log('ARIA RECS :',ariaRecommendations);
                                    const recommendation = ariaRecommendations[lineText];
                                    const displayedRec = `**Ludwig Recommendation:**\n\n- ${recommendation.desc}`;
                                    // console.log('DISPLAYED REC:',recommendation.desc);
                                    const firstLink = recommendation.link instanceof Array ? recommendation.link[0] : recommendation.link;
                                    const displayedLink = `[Read More](${firstLink})`;
                                    const hoverMessage = new vscode.MarkdownString();
                                    hoverMessage.appendMarkdown(`${displayedRec}\n\n${displayedLink}`);
                                    return new vscode.Hover(hoverMessage, wordRange);
                                });
                        }
                    }
                }
            }

            return null;
        }
    });

    //Primary Sidebar Webview View Provider
    class SidebarProvider {
        constructor(){}
        //Call when view first becomes visible:
        resolveWebviewView(webviewView: vscode.WebviewView) {
            webviewView.webview.options = {
              enableScripts: true,  //enable JS
            };
            //TO DO: Decide which content to allow in meta http-equiv Content security policy:
            //<meta http-equiv="Content-Security-Policy" content="default-src 'none';">
            webviewView.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    
                    </head>
                    <body>
                        <h3>Improve the accessibility of your website!</h3>
                        <p>Click the button below to scan the current HTML document and generate a report on how to improve your code for accessibility</p>
                        <div id="root"></div>
                        <button>Scan Document</button>
                        <script>
                            window.vscodeApi = acquireVsCodeApi();
                            const button = document.querySelector('button');
                            button.addEventListener('click', () => {
                                window.vscodeApi.postMessage({ message: 'scanDoc' });
                            });
                        </script>
                    </body>
                </html>
            `;
            //Handle messages or events from Sidebar webview view here            
            webviewView.webview.onDidReceiveMessage((message) => {
                if (message.message === 'scanDoc') {
                    // console.log('Received a message from webview:', message);
                    const panel = createDashboard(); //create dashboard panel webview when user clicks button
                }
            }); 
            
        }
    }

    //Register Primary Sidebar Provider
    const sidebarProvider = new SidebarProvider();
    const sidebarDisposable = vscode.window.registerWebviewViewProvider("ludwigSidebarView", sidebarProvider);
    
    //Create dashboard panel
    const createDashboard = () => {
        const dashboard = vscode.window.createWebviewPanel(
            'ludwig-dashboard', // Identifies the type of the webview (Used internally)
            'Ludwig Dashboard', //Title of the webview panel
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                enableScripts: true,
                retainContextWhenHidden: true, //keep state when webview is not in foreground
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src'))], //restrict Ludwig Dashboard webview to only load resources from src
            }
        );
        //Load bundled dashboard React file into the panel webview
        const dashboardPath = vscode.Uri.file(path.join(context.extensionPath, 'src','react-dashboard','dist', 'bundle.js')); //TO DO: Verify path
        const dashboardSrc = dashboard.webview.asWebviewUri(dashboardPath);
        
        //TO DO : Create Path and Src for CSS files
        const cssPath = path.join(context.extensionPath,'src','react-dashboard', 'src', 'style.css');
        const cssSrc = dashboard.webview.asWebviewUri(vscode.Uri.file(cssPath));
        
        // TO DO: Add to bottom of HTML body : <script src="${dashboardSrc}"></script>
        dashboard.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="${cssSrc}">
                </head>
                <body>
                    <h3>Ludwig Dashboard</h3>
                    <div id="root"></div>
                    <script src="${dashboardSrc}"></script>
                </body>
            </html>
        `;
      return dashboard;
    };


    context.subscriptions.push(
        highlightCommandDisposable,
        documentOpenDisposable,
        hoverProviderDisposable,
        documentChangeDisposable,
        activeEditorChangeDisposable,
        sidebarDisposable
    );
}

export function deactivate() {}
