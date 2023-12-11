const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function hasDLParent(htmlTest) {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor && activeEditor.document.languageId === 'html') {
        const htmlCode = activeEditor.document.getText();
        const { window } = new JSDOM(htmlCode);
        const document = window.document;
        const ludwig = document.body;

        const tagForRevision = [];
        
        const dtTags = document.querySelectorAll('dt');
        const ddTags = document.querySelectorAll('dd');
        
        dtTags.forEach((tag) => {
            // const lineNumber = activeEditor.document.positionAt(tag.startOffset).line;
            if(tag.parentNode.tagName.toLowerCase() !== 'dl') {
                tagForRevision.push(tag.outerHTML);
            }
        });

        ddTags.forEach((tag) => {
            // const lineNumber = activeEditor.document.positionAt(tag.startOffset).line;
            if(tag.parentNode.tagName.toLowerCase() !== 'dl') {
                tagForRevision.push(tag.outerHTML);
            }
        });
        
        // look through and check each aria tag for missing text 
        
    return tagForRevision;
    }
}

module.exports = {
    hasDLParent
};