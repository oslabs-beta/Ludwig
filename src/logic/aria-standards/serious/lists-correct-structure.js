const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// check that lists are structured correctly (dl, ul, and ol elements)
function checkListStructure() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // output array for fail cases
    const incorrectListElements = [];

    const ul = ludwig.querySelectorAll('ul');
    const ol = ludwig.querySelectorAll('ol');

    // iterate through <ul> elements
    // check child nodes exist AND that they are <li>
    let index = 0;
    const set = new Set();

    while (index < ul.length) {
      const listItems = [];
      for (const child of ul[index].children) {
        const lineNumber = getLineNumber(activeEditor.document, tag.outerHTML, set);
        set.add(lineNumber);
        if (child.tagName === 'LI' && child.innerHTML === '') {
          incorrectListElements.push([ul[index], lineNumber]);
          break;
        } else if (child.tagName === 'LI') {
          listItems.push(child.tagName);
        } else {
          incorrectListElements.push([ul[index], lineNumber]);
          break;
        }
      }
      if (listItems.length === 0 && !incorrectListElements.includes(ul[index])) {
        incorrectListElements.push(ul[index]);
      }
      index++;
    }

    // iterate through <ol> elements
    // check child nodes exist AND that they are <li>
    let count = 0;
    while (count < ol.length) {
      const listItems = [];
      for (const child of ol[count].children) {
        const lineNumber = getLineNumber(activeEditor.document, child.outerHTML, set);
        set.add(lineNumber);
        // console.log(child.innerHTML);
        if (child.tagName === 'LI' && child.innerHTML === '') {
          incorrectListElements.push([ol[count], lineNumber]);
          break;
        } else if (child.tagName === 'LI') {
          listItems.push(child.tagName);
        } else {
          incorrectListElements.push([ol[count], lineNumber]);
          break;
        }
      }
      const lineNumber = getLineNumber(activeEditor.document, ol[count].outerHTML, set);
      set.add(lineNumber);
      if (listItems.length === 0 && !incorrectListElements.includes(ol[count])) {
        incorrectListElements.push(ol[count]);
      }
      count++;
    }

    return incorrectListElements;
  }
}

module.exports = {
  checkListStructure,
};
