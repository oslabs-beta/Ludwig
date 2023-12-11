// needs testing. If it works, move to critical
const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function htmlHasTitle(htmlTest) {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor && activeEditor.document.languageId === 'html') {
        const htmlCode = activeEditor.document.getText();
        const { window } = new JSDOM(htmlCode);
        const document = window.document;
        const ludwig = document.body;

        const tagForRevision = [];
        const headEle = document.querySelector('head');
        const title = headEle.querySelector('title');
        const hasTitle = (title && title.textContent);
        const lineNumber = activeEditor.document.positionAt(title.startOffset).line;
        
        if(!hasTitle) {
            tagForRevision.push([headEle.outerHTML, lineNumber]);
        }
        
        // look through and check each aria tag for missing text 
        
    return tagForRevision;
    }
}

module.exports = {
    htmlHasTitle
};