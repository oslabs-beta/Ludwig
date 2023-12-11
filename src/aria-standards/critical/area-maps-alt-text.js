const vscode = require('vscode');
const { JSDOM } = require('jsdom');

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
    
    // check if each el has alt text
    areas.forEach((el, i) => {
      // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
      const altText = el.getAttribute('alt');

      if (!altText | altText === '') {
        areaMapsWithoutAltText.push(el.outerHTML);
      }
    });
    return areaMapsWithoutAltText;
  }
}

module.exports = {
  checkAreaMapAltText
}