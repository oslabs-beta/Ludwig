const vscode = require('vscode');
const { JSDOM } = require('jsdom');

async function checkLabels() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // const htmlLines = document.documentElement.outerHTML.split('\n');
    // const lineCount = htmlLines.length + 2;
    // console.log(lineCount);

    const formArray = [];
    const forms = ludwig.querySelectorAll('form');
    const labels = ludwig.querySelectorAll('label'); //collection of all elements in the body with a label tag.
    const inputs = ludwig.querySelectorAll('input'); //collection of all elements in the body with a input tag

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
        // console.log(labelsArray[i]);
          const inputId = inputsArray[i].getAttribute('id');
          const labelFor = labelsArray[i].getAttribute('for');
          if (inputId !== labelFor) {
            // console.log('Offset: ', labelsArray[i].startOffset);
            // console.log('position obj: ', activeEditor.document.positionAt(labelsArray[i].startOffset));
            // const lineNumber = activeEditor.document.positionAt(labelsArray[i].startOffset).line;
            // console.log(lineNumber);
            formArray.push(labelsArray[i].outerHTML);
            // formArray.push(inputsArray[i].outerHTML);
          }
      }
    });
    // console.log('formArray: ',formArray);
    return formArray;
  }
}

module.exports = {
  checkLabels
};