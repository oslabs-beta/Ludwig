const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function testAnchorLabels() {
  const activeEditor = vscode.window.activeTextEditor;
  const set = new Set();

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;

    const anchorsWithNoText = [];
    const anchorElements = document.querySelectorAll('a');

    anchorElements.forEach((anchorElement) => {
      const lineNumber = getLineNumber(activeEditor.document, anchorElement.outerHTML, set);
      set.add(lineNumber);
      // const lineNumber = activeEditor.document.positionAt(anchorElement.startOffset).line;
      const textContent = anchorElement.textContent.trim();

      if (!textContent) {
        anchorsWithNoText.push([anchorElement.outerHTML, lineNumber]);
      }
    });

    return anchorsWithNoText;
  }
}

module.exports = {
  testAnchorLabels,
};
