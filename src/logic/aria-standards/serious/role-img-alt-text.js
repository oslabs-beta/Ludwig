const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// check that elements with role=”img” have alternate text
function checkRoleImgAltText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // output array for fail cases
    const roleImgNoAltTxt = [];
    const set = new Set();

    const imgs = ludwig.querySelectorAll('*[role="img"]');

    // iterate through elements with role="img"
    // if alt text does not exist then push into failed arr
    imgs.forEach((el) => {
      const lineNumber = getLineNumber(activeEditor.document, el.outerHTML, set);
      set.add(lineNumber);
      const altText = el.getAttribute('alt');
      if (!altText) {
        roleImgNoAltTxt.push([el, lineNumber]);
      }
    });
    return roleImgNoAltTxt;
  }
}

module.exports = {
  checkRoleImgAltText,
};
