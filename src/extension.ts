import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "ludwig" is now active!');

    // Map to track highlighted HTML elements and their positions
    const highlightedElements = new Map<string, vscode.Range[]>();

    // Function to highlight elements based on a condition (to be defined later)
    function highlightElements(document: vscode.TextDocument) {
        // Define the logic to highlight HTML elements based on certain conditions
        // Add ranges of elements to the highlightedElements map
    }

    // Command to trigger the highlighting functionality
    let highlightCommandDisposable = vscode.commands.registerCommand('ludwig.highlightElements', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.languageId === 'html') {
            const document = activeEditor.document;
            highlightElements(document);
        }
    });

    // Register onDidOpenTextDocument event to immediately highlight elements when an HTML file is opened
    let documentOpenDisposable = vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
        if (document.languageId === 'html') {
            highlightElements(document);
        }
    });

    // Hover provider to show a popup window with ARIA recommendations
    let hoverProviderDisposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'html' }, {
        provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position, /<\w+>/);
            if (wordRange) {
                const word = document.getText(wordRange);

                // Check if the element has been highlighted
                const highlightedRanges = highlightedElements.get(word);
                if (highlightedRanges) {
                    // Define the ARIA recommendation information based on the highlighted element
                    const ariaRecommendationInfo = 'ARIA recommendation: [info to be defined later]';

                    const hoverMessage = new vscode.MarkdownString(ariaRecommendationInfo);
                    return new vscode.Hover(hoverMessage, wordRange);
                }
            }
            return null;
        }
    });

    context.subscriptions.push(highlightCommandDisposable, documentOpenDisposable, hoverProviderDisposable);
}

export function deactivate() {}
