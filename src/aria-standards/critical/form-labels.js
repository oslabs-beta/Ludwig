const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function checkLabels() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const set = new Set(); // so getLineNumber function doesn't just get the first line it finds each time
    const formArray = [];
    const forms = ludwig.querySelectorAll('form');

    forms.forEach((form) => {
      const formChildren = form.children;
      const labelsArray = [];
      const inputsArray = [];
      for (const child of formChildren) {
        if (child.tagName === 'LABEL') {
          labelsArray.push(child);
        }
        if (child.tagName === 'INPUT') {
          inputsArray.push(child);
        }
      }

      for (let i = 0; i < labelsArray.length; i++) {
          const inputId = inputsArray[i].getAttribute('id');
          const labelFor = labelsArray[i].getAttribute('for');
          const lineNumber = getLineNumber(activeEditor.document, labelsArray[i].outerHTML, set);
          set.add(lineNumber);
          if (inputId !== labelFor) {
            formArray.push([labelsArray[i].outerHTML, lineNumber]);
          }
      }
    });
    return formArray;
  }
}

module.exports = {
  checkLabels
};