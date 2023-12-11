const vscode = require('vscode');
const { JSDOM } = require('jsdom');



// <input type=”image”> elements have alternative text
function checkImgAltText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;
    
    const imgAlt = [];
  // const images = ludwig.images; <-- returns html collection
  // const images = ludwig.getElementsByTagName("img"); <-- returns html collection
    const img = ludwig.querySelectorAll('img');
  // console.log('images', img);

    img.forEach((img, index) => {
      const lineNumber = activeEditor.document.positionAt(img.startOffset).line;
      const altText = img.getAttribute('alt');
      // console.log('alt text', altText);

      if (!altText) {
          imgAlt.push([img.outerHTML, lineNumber]);
      }
  });
  return imgAlt;
  }
}

module.exports = {
  checkImgAltText
};

