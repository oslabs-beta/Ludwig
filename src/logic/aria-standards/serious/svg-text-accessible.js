const vscode = require('vscode');
const { JSDOM } = require('jsdom');

// check that all <svg> elements are either text-accessible or hidden
function checkSVGForText() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // output array for fail cases
    const incorrectSVGText = [];

    // Remove, hide, or mask the non-text content
    // Replace it with the text alternative
    // Check that nothing is lost (the purpose of the non-text content is met by the text alternative)
    // If the non-text content contains words that are important to understanding the content, the words are included in the text alternative
    const svgEl = ludwig.querySelectorAll('svg');
    const imgEl = ludwig.querySelectorAll('img');
    const buttonEl = ludwig.querySelectorAll('button');
    const linkEl = ludwig.querySelectorAll('a');

    return incorrectSVGText;
  }
}

module.exports = {
  checkSVGForText,
};
