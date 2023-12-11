const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function selectName() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const selectArray = [];

    const selectElements = ludwig.querySelectorAll('select');

    selectElements.forEach((ele, index) => {
      // const lineNumber = activeEditor.document.positionAt(ele.startOffset).line;  
      let nameAttribute = ele.getAttribute('name');
        if (!nameAttribute) {
          selectArray.push(ele.outerHTML);
        }
    });
    return selectArray; 
  }
}

module.exports = {
  selectName
};