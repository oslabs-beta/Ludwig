const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function findSwitchElementsWithNoChildText() {
    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor && activeEditor.document.languageId === 'html') {
        const htmlCode = activeEditor.document.getText();
        const { window } = new JSDOM(htmlCode);
        const document = window.document;
        

        const switchesWithNoChildText = [];
        const switches = document.querySelectorAll('[role="switch"]');

        // Iterate through each switch element
        switches.forEach((switchElement) => {
            // const lineNumber = activeEditor.document.positionAt(switchElement.startOffset).line;
            const parentText = switchElement.textContent;
            // Check if there is at least one child element with text content
            const hasChildWithText = Array.from(switchElement.children).some((child) => {
                return child.textContent.trim().length > 0;
            });

            if (!hasChildWithText && !parentText) {
                switchesWithNoChildText.push(switchElement.outerHTML);
            }
        });
        return switchesWithNoChildText;
    }
}

module.exports = {
    findSwitchElementsWithNoChildText
};
