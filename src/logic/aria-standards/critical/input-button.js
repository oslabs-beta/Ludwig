const vscode = require('vscode');
// const { JSDOM } = require('jsdom');
// const { getLineNumber } = require('../../getLineNumber');

// input button has discernible text
function inputButtonText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const input = ludwig.querySelectorAll('input');
    
    const inputButtonsWithoutText = [];
    const set = new Set();
    // check that value is not an empty string or missing
    input.forEach((el, index) => {
      const lineNumber = getLineNumber(activeEditor.document, el.outerHTML, set);
      set.add(lineNumber);
      if (el.value === '' || !el.value) {
        inputButtonsWithoutText.push([el.outerHTML, lineNumber]);
        // console.log(`Input Button ${index + 1} does not have a value.`);
      }
    });
    return inputButtonsWithoutText;
  }
}

module.exports = {
  inputButtonText
};