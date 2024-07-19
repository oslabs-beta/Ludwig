const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// check that doc has a lang attribute
function containsLangAttr() {
  const activeEditor = vscode.window.activeTextEditor;

  const set = new Set();

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const ludwig = window.document;

    const html = ludwig.querySelector('html');
    const lang = ludwig.querySelector('html[lang]');

    const lineNumber = getLineNumber(activeEditor.document, html.outerHTML, set);
    set.add(lineNumber);

    if (!lang) {
      return [html, lineNumber];
    }
  }
}

module.exports = {
  containsLangAttr,
};
