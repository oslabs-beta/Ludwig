const vscode = require('vscode');
const { JSDOM } = require('jsdom');

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

    const elementsWithId = ludwig.querySelectorAll('[id]');
    
    elementsWithId.forEach(element => {
      // const lineNumber = activeEditor.document.positionAt(ele.startOffset).line;
      const id = element.id;

      if (idSet.has(id)) {
        // console.error(`Duplicate id found: ${id}`);
        // Store the element with duplicate id in the array
        duplicateElements.push(element.outerHTML);
      } else {
        idSet.add(id);
      }
    });

    return duplicateElements;

  // if (duplicateElements.length > 0) {
  //   console.log('Elements that duplicate ids:');
  //   duplicateElements.forEach((element, index) => {
  //     console.log(`Element ${index + 1}:`);
  //     console.log(element);
  //   });
  // } else {
  //   console.log('No duplicate ids found.');
  // }
  }
}

module.exports = {
  checkUniqueIds
};