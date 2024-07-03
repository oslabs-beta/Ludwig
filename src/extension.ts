import * as vscode from 'vscode';
import * as path from 'path';
const { compileLogic } = require('./logicCompiler.ts');
import getAccessScore from './access-score';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');
  /* 
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
            const highlightedLines = new Set<number>(); // ensures the same line doesn't highlight more than once

            // invoke compileLogic to get object with ARIA recommendations
            const ariaRecommendations = await compileLogic(document);
            const elementsToHighlight = Object.keys(ariaRecommendations);
            // console.log('ariaRecommendations: ', ariaRecommendations);
            // console.log('elementsToHighlight: ', elementsToHighlight);

            // Loop through each line in the document
            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
                const line = document.lineAt(lineNumber);

                // Check if the line's content matches any element to highlight
                const key = line.text.trim();
                // const nextKey = nextLine.text.trim();
                // console.log('key: ', key);

                // boolean to determine whether we push into highlightedRanges
                let keyFound = false;

                // check if elementsToHighlight contains a line - checks line number to avoid dupes later
                for(const el of elementsToHighlight){    
                    // console.log('el: ', el);
                    // console.log(el.includes(key));
                    // console.log(el.includes(nextKey));                
                    // console.log('line.lineNumber: ', line.lineNumber + 1);
                    // console.log('ariaRecommendations[el][1]: ', ariaRecommendations[el][1]);
                    if(line.lineNumber + 1 === Number(el) && ariaRecommendations[el][1].includes(key) && key.trim() !== ''){
                        keyFound = true;
                        break;
                    }
                }

                // only adds line to highlightedRanges if key was found and that exact line isn't currently highlighted
                if (keyFound && !highlightedLines.has(lineNumber)) {
                    // creates a range for the entire line
                    const lineRange = new vscode.Range(line.range.start, line.range.end);
                    highlightedRanges.push(lineRange);
                    // console.log('highlightedRanges: ', highlightedRanges);
                    highlightedLines.add(lineNumber);
                    // console.log('highlightedLines: ', highlightedLines);
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
                                    const lineNumber = range.start.line + 1;
                                    // console.log('LINENUMBER ', lineNumber);
                                    const recommendation = ariaRecommendations[String(lineNumber)][0];
                                    const displayedRec = `**Ludwig Recommendation:**\n\n- ${recommendation.desc}`;
                                    // console.log('DISPLAYED REC:',recommendation.desc);
                                    const firstLink = recommendation.link instanceof Array ? recommendation.link[0] : recommendation.link;
                                    const displayedLink = `[Read More](${firstLink})`;
                                    const hoverMessage = new vscode.MarkdownString();
                                    hoverMessage.appendMarkdown(`${displayedRec}\n\n${displayedLink}`);
                                    return new vscode.Hover(hoverMessage, wordRange);
                                })
                                .catch((error : any) => {
                                    console.error('An Error Occurred Retrieving Data for Hover', error);
                                });
                        }
                    }
                }
            }
            return null;
        }
    }); */

  //Primary Sidebar Webview View Provider
  class SidebarProvider {
    //Call when view first becomes visible:
    resolveWebviewView(webviewView: vscode.WebviewView) {
      webviewView.webview.options = {
        enableScripts: true, //enable JS
      };
      //Load bundled dashboard React file into the panel webview
      const sidebarPath = vscode.Uri.file(
        path.join(context.extensionPath, 'react-sidebar', 'dist', 'bundle.js')
      );
      const sidebarSrc = webviewView.webview.asWebviewUri(sidebarPath);

      //Create Path and Src for CSS files
      const cssPath = path.join(
        context.extensionPath,
        'react-sidebar',
        'src',
        'style.css'
      );
      const cssSrc = webviewView.webview.asWebviewUri(vscode.Uri.file(cssPath));
      //TO DO: Decide which content to allow in meta http-equiv Content security policy:
      //<meta http-equiv="Content-Security-Policy" content="default-src 'none';">
      webviewView.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="stylesheet" type="text/css" href="${cssSrc}">
                    </head>
                    <body>
                        <div id="root"></div>
                        <script>
                            window.vscodeApi = acquireVsCodeApi();
                        </script>
                        <script src="${sidebarSrc}"></script>
                    </body>
                </html>
            `;

      //Handle messages or events from Sidebar webview view here
      webviewView.webview.onDidReceiveMessage((message) => {
        //if message is sent from  sidepanel & and if the active document is html, then create a dashboard
        if (message.message === 'scanDoc') {
          //   &&  activeEditor && activeEditor.document.languageId === 'html'
          const panel = createDashboard(); //create dashboard panel webview when user clicks button
          let results = compileLogic();
          console.log(results);

          let scoreData = getAccessScore(results);
          panel.webview.postMessage({ data: results, recData: scoreData });
        }
      });
    }
  }

  //Register Primary Sidebar Provider
  const sidebarProvider = new SidebarProvider();
  const sidebarDisposable = vscode.window.registerWebviewViewProvider(
    'ludwigSidebarView',
    sidebarProvider
  );
  let dashboard: any = null;

  //Create dashboard panel
  const createDashboard = () => {
    if (dashboard) {
      dashboard.dispose();
    }
    dashboard = vscode.window.createWebviewPanel(
      'ludwig-dashboard', // Identifies the type of the webview (Used internally)
      'Ludwig Dashboard', //Title of the webview panel
      vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
      {
        enableScripts: true,
        retainContextWhenHidden: true, //keep state when webview is not in foreground
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'react-dashboard')),
        ], //restrict Ludwig Dashboard webview to only load resources from react-dashboard
      }
    );
    //Load bundled dashboard React file into the panel webview
    const dashboardPath = vscode.Uri.file(
      path.join(context.extensionPath, 'react-dashboard', 'dist', 'bundle.js')
    );
    const dashboardSrc = dashboard.webview.asWebviewUri(dashboardPath);

    //Create Path and Src for CSS files
    const cssPath = path.join(
      context.extensionPath,
      'react-dashboard',
      'src',
      'style.css'
    );
    const cssSrc = dashboard.webview.asWebviewUri(vscode.Uri.file(cssPath));

    dashboard.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="${cssSrc}">
                </head>
                <body>
                    <div id="root"></div>
                    <script src="${dashboardSrc}"></script>
                </body>
            </html>
        `;
    dashboard.onDidDispose(() => {
      dashboard = null;
    });
    return dashboard;
  };

  context.subscriptions.push(
    // highlightCommandDisposable,
    // toggleOffCommandDisposable,
    // documentOpenDisposable,
    // hoverProviderDisposable,
    // documentChangeDisposable,
    // activeEditorChangeDisposable,
    sidebarDisposable
  );
}

export function deactivate() {}
