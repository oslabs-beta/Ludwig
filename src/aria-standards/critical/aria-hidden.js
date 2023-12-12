const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// Logic for aria-hidden="true"
function checkAriaHidden() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

  const allElement = ludwig.querySelectorAll('*');

  const hiddenAria = [];
  const set = new Set();

  const hiddenElements = Array.from(allElement).filter(element => {
    const ariaHiddenAtt = element.getAttribute('aria-hidden');
    return ariaHiddenAtt === 'true';
  });

  if (hiddenElements.length > 0) {
      hiddenElements.forEach((element, index) => {
        const lineNumber = getLineNumber(activeEditor.document, element, set);
        set.add(lineNumber);
        hiddenAria.push([element.outerHTML, lineNumber]);
    });
    }
    return hiddenAria;
  }
};

module.exports = {
  checkAriaHidden
};