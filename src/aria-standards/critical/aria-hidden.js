const vscode = require('vscode');
const { JSDOM } = require('jsdom');

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

  const hiddenElements = Array.from(allElement).filter(element => {
    const ariaHiddenAtt = element.getAttribute('aria-hidden');
    return ariaHiddenAtt === 'true';
  });

  if (hiddenElements.length > 0) {
      hiddenElements.forEach((element, index) => {
        hiddenAria.push(element.outerHTML);
      // console.log(`Element ${index + 1}, ${element.outerHTML}`);
    });
    }
    return hiddenAria;
  }
};

module.exports = {
  checkAriaHidden
};