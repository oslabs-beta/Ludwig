const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');


// <meta http-equiv=”refresh”> is not used for delayed refresh
function checkMetaHttpRefresh() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const meta = document.querySelectorAll('meta');

    const metaWrongContent = [];
    const set = new Set();
    
    // check if each el has http-equiv attribute
    meta.forEach((el, i) => {
      const httpEquiv = el.getAttribute('http-equiv');
      const content = el.getAttribute('content');

      if (httpEquiv === 'refresh') {
        const newEl = el.outerHTML.replace('>', ' />');
        const lineNumber = getLineNumber(activeEditor.document, newEl, set);
        set.add(lineNumber);
        // if content does not exist, does not begin with the number 0 or is not followed by "URL="
        if (!content || content[0] !== '0' || !content.includes('URL=')) {
          metaWrongContent.push([newEl, lineNumber]);
        }
      };
    });
    return metaWrongContent;
  }
}

module.exports = {
  checkMetaHttpRefresh
};