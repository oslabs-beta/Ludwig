const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// buttons have discernible text
function checkButtonText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const buttons = ludwig.querySelectorAll('button');
  // console.log(buttons);
    const buttonsArray = [];
    const set = new Set();

  // check innerHTMl or innerText to make sure it is not missing or an empty string
    buttons.forEach((el, i) => {
      const lineNumber = getLineNumber(activeEditor.document, el, set);
      set.add(lineNumber);
      if (el.innerHTML === '') {
        buttonsArray.push([el.outerHTML, lineNumber]);
      } 
    });
    return buttonsArray;
  }
}

module.exports = {
  checkButtonText
};
