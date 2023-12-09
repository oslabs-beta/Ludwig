const vscode = require('vscode');
const { JSDOM } = require('jsdom');

// check that <object> elements have alternate text
function checkObjAltText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // output array for fail cases
    const objsWithoutAltTxt = [];

    const objects = ludwig.querySelectorAll('object');

    // iterate through object; if alt text doesn't exists then push into failed arr
    objects.forEach(el => {
      const altText = el.getAttribute('alt');
      if (!altText) {
        objsWithoutAltTxt.push(el);
      }
    });

    return objsWithoutAltTxt;
  }
}

module.exports = {
  checkObjAltText
};