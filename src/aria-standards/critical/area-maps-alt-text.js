const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// <area> elements of image maps have alternate text
function checkAreaMapAltText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const areas = ludwig.querySelectorAll('area');

    const areaMapsWithoutAltText = [];
    const set = new Set();
    
    // check if each el has alt text
    areas.forEach((el, i) => {
      const altText = el.getAttribute('alt');
      const newElement = el.outerHTML.replace('>', ' />');

      const lineNumber = getLineNumber(activeEditor.document, newElement, set);
      set.add(lineNumber);

      if (!altText | altText === '') {
        areaMapsWithoutAltText.push([newElement, lineNumber]);
      }
    });
    return areaMapsWithoutAltText;
  }
}

module.exports = {
  checkAreaMapAltText
};