const vscode = require('vscode');
const { JSDOM } = require('jsdom');

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
    // const labels = ludwig.querySelectorAll('label'); //collection of all elements in the body with a label tag.
    // const inputs = ludwig.querySelectorAll('input'); //collection of all elements in the body with a input tag

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
          const lineNumber = getLineNumber(activeEditor.document, labelsArray[i], set);
          set.add(lineNumber);
          if (inputId !== labelFor) {
            console.log('lineNumber: ', lineNumber);
            console.log('set: ', set);
            formArray.push([labelsArray[i].outerHTML, lineNumber]);
          }
      }
    });
    console.log('formArray: ',formArray);
    return formArray;
  }
}

function getLineNumber(document, node, set) {
  const htmlCode = document.getText();
  const lines = htmlCode.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if(!set.has(i + 1)){
      const line = lines[i];
      const indexInLine = line.indexOf(node.outerHTML);
      if (set.has(indexInLine)) {
        line.indexOf(node.outerHTML, indexInLine+1);
      }
  
      if (indexInLine !== -1) {
        return i + 1;
      }
    }
  }
}


module.exports = {
  checkLabels
};