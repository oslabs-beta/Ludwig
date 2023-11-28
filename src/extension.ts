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
            //is a vscode.Range (which is an obj) of whatever word that the cursor is currently positioned over. Range auto separates by spaces.
            const wordRange = document.getWordRangeAtPosition(position); 

            if (wordRange) { //checks if the cursor is currently on a word or letter
                const hoveredWord = document.getText(wordRange).toLowerCase(); //gets only the text of current word being hovered over
                // console.log(word);

                //is an array where each element is a vscode.Range Object representing the range of the highlighted line
                const highlightedRanges = highlightedElements.get('ariaRecommendations'); 

                // console.log(document.getText(highlightedRanges[0])); //gets the text of the highlighted line (first line only)
                
                //checks if at least 1 of the  highlighted ranges completely contains the range of the currently hovered word, if so display popup
                if (highlightedRanges && highlightedRanges.some((range) => range.contains(wordRange))) {
                    for (const range of highlightedRanges){
                        const lineRange = new vscode.Range(range.start.line, 0, range.end.line, document.lineAt(range.end.line).text.length);
                        const lineText = document.getText(lineRange).trim();
                        // console.log('highlighted line:', lineText);

                        // if(lineText.includes(hoveredWord)) { //checks if the highlighted line
                            // console.log(`${lineText} HAS ${hoveredWord}`);

                            return compileLogic()
                                .then((ariaRecommendations : object) => {//gets an object with {key= each element that failed, value =  associated recommendation}
                                    const recommendation = ariaRecommendations[lineText];
                                    // console.log('ariaRecommendation',ariaRecommendations);
                                    // console.log('recommendation',recommendation);
                                    const displayedRec = `${recommendation}`;
                                    const displayedLink = `[Read More](https://developer.mozilla.org/en-US/docs/Web/Accessibility)`;
                                    const hoverMessage = new vscode.MarkdownString();
                                    hoverMessage.appendMarkdown(`${displayedRec}\n\n${displayedLink}`);
                                    return new vscode.Hover(hoverMessage, lineRange);
                                });
                        // }
                    }
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
