const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');


function selectName() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const selectArray = [];
    const set = new Set();

    const selectElements = ludwig.querySelectorAll('select');

    selectElements.forEach((ele, index) => {
      let nameAttribute = ele.getAttribute('name');
      const lineNumber = getLineNumber(activeEditor.document, ele, set);
      set.add(lineNumber);
        if (!nameAttribute) {
          selectArray.push([ele.outerHTML, lineNumber]);
        }
    });
    return selectArray; 
  }
}

module.exports = {
  selectName
};