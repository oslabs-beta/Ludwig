const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');


// <input type=”image”> elements have alternative text
function checkImgAltText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;
    
    const imgAlt = [];
    const set = new Set();
  // const images = ludwig.images; <-- returns html collection
  // const images = ludwig.getElementsByTagName("img"); <-- returns html collection
    const img = ludwig.querySelectorAll('img');
  // console.log('images', img);

    img.forEach((img, index) => {
      const altText = img.getAttribute('alt');
      // console.log('alt text', altText);
      const newImg = img.outerHTML.replace('>', ' />'); // JSDOM seems to grab self-closing tags without closing slash
      const lineNumber = getLineNumber(activeEditor.document, newImg, set);
      set.add(lineNumber);

      if (!altText) {
          imgAlt.push([newImg, lineNumber]);
      }
  });
  return imgAlt;
  }
}

module.exports = {
  checkImgAltText
};

