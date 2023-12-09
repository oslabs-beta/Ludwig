const vscode = require('vscode');
const { JSDOM } = require('jsdom');

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
    while (index < ul.length) {
      const listItems = [];
      for (const child of ul[index].children) {
        if (child.tagName === 'LI' && child.innerHTML === '') {
          incorrectListElements.push(ul[index]);
          break;
        } else if (child.tagName === 'LI') {
          listItems.push(child.tagName);
        } else {
          incorrectListElements.push(ul[index]);
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
        console.log(child.innerHTML);
        if (child.tagName === 'LI' && child.innerHTML === '') {
          incorrectListElements.push(ol[count]);
          break;
        } else if (child.tagName === 'LI') {
          listItems.push(child.tagName);
        } else {
          incorrectListElements.push(ol[count]);
          break;
        }
      }
      if (listItems.length === 0 && !incorrectListElements.includes(ol[count])) {
        incorrectListElements.push(ol[count]);
      }
      count++;
    }

    return incorrectListElements;
  }
}

module.exports = {
  checkListStructure
};