const vscode = require('vscode');
const { JSDOM } = require('jsdom');

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

  // check innerHTMl or innerText to make sure it is not missing or an empty string
    buttons.forEach((el, i) => {
      if (el.innerHTML === '') {
        buttonsArray.push(el.outerHTML);
      } 
    });
    return buttonsArray;
  }
}

module.exports = {
  checkButtonText
};
