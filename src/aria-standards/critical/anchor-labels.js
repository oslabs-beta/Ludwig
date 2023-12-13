const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');


// logic for if anchors lack a label
function evalAnchors() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;
  
    const anchors = ludwig.querySelectorAll('a');

    // push missing anchors into array
    const anchorsWithoutAriaLabel = [];
    const set = new Set();

    anchors.forEach((link, index) => {
      const ariaLabel = link.getAttribute('aria-label');

      const lineNumber = getLineNumber(activeEditor.document, link.outerHTML, set);
      set.add(lineNumber);
      if (!ariaLabel) {
        anchorsWithoutAriaLabel.push([link.outerHTML, lineNumber]); // push here
      }
    });
    
    return anchorsWithoutAriaLabel; // return that array
  }
}


module.exports = {
  evalAnchors
};