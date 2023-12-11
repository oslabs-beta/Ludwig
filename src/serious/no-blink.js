const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function findBlinkElements() {
    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor && activeEditor.document.languageId === 'html') {
        const htmlCode = activeEditor.document.getText();
        const { window } = new JSDOM(htmlCode);
        const document = window.document;

        const blinkElements = document.querySelectorAll('blink');

        if (blinkElements.length > 0) {
            // Blink elements found
            const blinkOccurrences = Array.from(blinkElements).map((blinkElement) => {
                const lineNumber = activeEditor.document.positionAt(blinkElements.startOffset).line;
                return [blinkElement.outerHTML, lineNumber];
            });
            return blinkOccurrences;
        } 
    } 
}

module.exports = {
    findBlinkElements
};
