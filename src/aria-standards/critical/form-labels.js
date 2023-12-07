const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function checkLabels() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const formArray = [];
    const forms = ludwig.querySelectorAll('form');
    // console.log(forms);
    const labels = ludwig.querySelectorAll('label'); //collection of all elements in the body with a label tag.
    // console.log(labels);
    const inputs = ludwig.querySelectorAll('input'); //collection of all elements in the body with a input tag
    // console.log(inputs);

    forms.forEach((form) => {
      const formChildren = form.children;
      // console.log(formChildren);
      const labelsArray = [];
      const inputsArray = [];
      for (const child of formChildren) {
        // console.log(child.tagName);
        if (child.tagName === 'LABEL') {
          labelsArray.push(child);
        }
        if (child.tagName === 'INPUT') {
          inputsArray.push(child);
        }
      }
      // console.log(labelsArray);
      // console.log(inputsArray);
      for (let i = 0; i < labelsArray.length; i++) {
        // console.log(labelsArray[i]);
          const inputId = inputsArray[i].getAttribute('id');
          const labelFor = labelsArray[i].getAttribute('for');
          if (inputId !== labelFor) {
            formArray.push(form.outerHTML);
            // const outerHTMLContent = form.outerHTML;
            // // console.log('outerHTMLContent: ', outerHTMLContent);

            // // snag the index of the first newline character
            // const indexOfNewline = outerHTMLContent.indexOf('\n');

            // // snag the first line using substring
            // const firstLine = indexOfNewline !== -1 ? outerHTMLContent.substring(0, indexOfNewline) : outerHTMLContent;
            // formArray.push(firstLine); // this handles the inputs and labels being put on separate lines!!!
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