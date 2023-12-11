// needs testing. If it works, move to critical
const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function iFrameComply(htmlTest) {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor && activeEditor.document.languageId === 'html') {
        const htmlCode = activeEditor.document.getText();
        const { window } = new JSDOM(htmlCode);
        const document = window.document;
        const ludwig = document.body;

        const tagForRevision = [];
        const frames = ludwig.querySelectorAll('frame, iframe');
          
        frames.forEach((tag) => {
            const title = tag.getAttribute('title');
            const tableIndex = parseInt(tag.getAttribute('tabindex') || 0, 10);
            const name = tag.getAttribute('name');
            console.log('name', name);
            // const lineNumber = activeEditor.document.positionAt(tag.startOffset).line;
          
            if (name === null || !title || tableIndex === -1) {
              tagForRevision.push(tag.outerHTML);
            }
        });
        return tagForRevision;
        }
    }
          

module.exports = {
    iFrameComply
};