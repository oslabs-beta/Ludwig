const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');


// check that all ids in doc are unique
function checkUniqueIds() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const idSet = new Set();
    const duplicateElements = [];
    const set = new Set();

    const elementsWithId = ludwig.querySelectorAll('[id]');
    
    elementsWithId.forEach(element => {
      const id = element.id;
      const lineNumber = getLineNumber(activeEditor.document, element.outerHTML, set);
      set.add(lineNumber);

      if (idSet.has(id)) {
        duplicateElements.push([element.outerHTML, lineNumber]);
      } else {
        idSet.add(id);
      }
    });
    return duplicateElements;
  }
}

module.exports = {
  checkUniqueIds
};