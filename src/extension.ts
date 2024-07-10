import * as vscode from 'vscode';
import * as path from 'path';
const { compileLogic } = require('./logicCompiler.ts');
import { ariaObject } from './aria-standards/critical/aria-object.js';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ludwig" is now active!');
  
    // create empty object to store recommendations by line number for hover functionality
    // {line number as string : array of aria-object keys}
    const recsByLineNumber: {[key: string]: string[]} = {};

    // Create decoration type outside of the function
    const decorationType = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        overviewRulerColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
    });

    let isExtensionActive = true;

    // Function to highlight lines
    function highlightElements(document: vscode.TextDocument) {
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
            // invoke compileLogic to get object with ARIA recommendations
            const ariaRecommendations = compileLogic();

            // populate recsByLineNumber
            for (const [ariaObjKey, recsArrays] of Object.entries(ariaRecommendations)) {
                // skip totalElements key
                if (ariaObjKey === 'totalElements') {
                    continue;
                }
                for (const [lineNumber, outerHTML] of recsArrays as [number, string][]) {
                    if (!recsByLineNumber[lineNumber]) {
                        recsByLineNumber[lineNumber] = [ariaObjKey];
                    } else if (!recsByLineNumber[lineNumber].includes(ariaObjKey)) {
                        // don't add duplicate ariaObjKeys to the same line
                        recsByLineNumber[lineNumber].push(ariaObjKey);
                    }
                }
            }

            // create array of ranges to highlight
            const highlightedRanges: vscode.Range[] = [];
            for (const lineNumber of Object.keys(recsByLineNumber)) {
                const line = document.lineAt(Number(lineNumber) - 1);
                const lineRange = line.range;
                // const lineRange = new vscode.Range(line.range.start, line.range.end);
                highlightedRanges.push(lineRange);
            }

            // Clear existing decorations before applying new ones - prevents red from getting brighter and brighter
            activeEditor.setDecorations(decorationType, []);
            
            // Apply red background thing to highlight the lines
            activeEditor.setDecorations(decorationType, highlightedRanges);    
        }
    }


    // Register onDidChangeTextDocument event to trigger highlighting when the document changes
    let documentChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'html') {
            if(isExtensionActive) {
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

            // check if there are recommendations for the line
            if (recsByLineNumber[position.line + 1]) {
                const ariaObjKeys = recsByLineNumber[position.line + 1];

                // create range for line
                const range = document.lineAt(position.line).range;
                
                let messageText = '';
                // loop through each recommendation for the line to create text for hover message
                for (let i = 0; i < ariaObjKeys.length; i++) {
                    // if there are multiple recommendations for the same line, add a line break between them
                    if (i > 0) {
                        messageText += '\n\n';
                    }

                    const description = ariaObject[ariaObjKeys[i]].desc;
                    messageText += `**Ludwig Recommendation:**\n\n- ${description}`;

                    const link = ariaObject[ariaObjKeys[i]].link;
                    messageText += `\n\n[Read More](${link})`;
                }

                const hoverMessage = new vscode.MarkdownString(messageText);

                return new vscode.Hover(hoverMessage, range);
            }

            return null;
        }
    });

  //Primary Sidebar Webview View Provider
  class SidebarProvider {
    resolveWebviewView(webviewView: vscode.WebviewView) {
      webviewView.webview.options = {
        enableScripts: true,
      };
      const sidebarPath = vscode.Uri.file(
        path.join(context.extensionPath, 'react-sidebar', 'dist', 'bundle.js')
      );
      const sidebarSrc = webviewView.webview.asWebviewUri(sidebarPath);

      const cssPath = path.join(
        context.extensionPath,
        'react-sidebar',
        'src',
        'style.css'
      );
      const cssSrc = webviewView.webview.asWebviewUri(vscode.Uri.file(cssPath));
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

      webviewView.webview.onDidReceiveMessage((message) => {
        const activeEditor: any = vscode.window.activeTextEditor;
        
        if (
          message.message === 'scanDoc' &&
          activeEditor.document.languageId === 'html'
        ) {
          const panel = createDashboard(); //create dashboard panel webview when user clicks button
          
          const ariaRecommendations = compileLogic();

          panel.webview.postMessage(ariaRecommendations);
        }
      });
    }
  }

  const sidebarProvider = new SidebarProvider();
  const sidebarDisposable = vscode.window.registerWebviewViewProvider(
    'ludwigSidebarView',
    sidebarProvider
  );
  let dashboard: any = null;

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
    highlightCommandDisposable,
    toggleOffCommandDisposable,
    documentOpenDisposable,
    hoverProviderDisposable,
    documentChangeDisposable,
    activeEditorChangeDisposable,
    sidebarDisposable
  );
}

export function deactivate() {}
