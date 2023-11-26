import * as vscode from 'vscode';
import * as path from 'path';
const { compileLogic } = require('./logicCompiler.ts');


export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "ludwig" is now active!');

    // Map to track highlighted HTML elements and their positions
    const highlightedElements = new Map<string, vscode.Range[]>();

    // Function to highlight lines containing "div"
// Function to highlight lines based on anchors without aria-label
    async function highlightElements(document: vscode.TextDocument) {
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
            const highlightedRanges: vscode.Range[] = [];

            // invoke compileLogic to get object with ARIA recommendations
            const ariaRecommendations = await compileLogic();

            // Loop through each line in the document
            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
                const line = document.lineAt(lineNumber);

                // Check if the line's anchor is in the object
                const key = line.text.trim();
                if (key in ariaRecommendations) {
                    // Create a range for the entire line
                    const lineRange = new vscode.Range(line.range.start, line.range.end);
                    highlightedRanges.push(lineRange);
                }
            }

            // Store the highlighted ranges in the map
            highlightedElements.set('ariaRecommendations', highlightedRanges);

            // Apply red background thing to highlight the lines
            const decorationType = vscode.window.createTextEditorDecorationType({
                isWholeLine: true,
                overviewRulerLane: vscode.OverviewRulerLane.Right,
                overviewRulerColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
            });

            activeEditor.setDecorations(decorationType, highlightedRanges);
        }
    }


    // Register onDidChangeTextDocument event to trigger highlighting when the document changes
    let documentChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'html') {
            highlightElements(event.document);
        }
    });

    // Register onDidChangeActiveTextEditor event to trigger highlighting when the active editor changes
    let activeEditorChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === 'html') {
            highlightElements(editor.document);
        }
    });

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
                const word = document.getText(wordRange).toLowerCase(); // Convert to lowercase for case-insensitive check

                // Check if the element has been highlighted
                const highlightedRanges = highlightedElements.get('ariaRecommendations');
                if (highlightedRanges && highlightedRanges.some((range) => range.contains(wordRange))) {
                    // Define the ARIA recommendation information based on the highlighted element
                    const ariaRecommendationInfo = 'ARIA recommendation: [info to be defined later]';

                    const hoverMessage = new vscode.MarkdownString(ariaRecommendationInfo);
                    return new vscode.Hover(hoverMessage, wordRange);
                }
            }
            return null;
        }
    });

    context.subscriptions.push(
        highlightCommandDisposable,
        documentOpenDisposable,
        hoverProviderDisposable,
        documentChangeDisposable,
        activeEditorChangeDisposable
    );
}

export function deactivate() {}
