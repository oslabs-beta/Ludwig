const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { langCodes } = require('./langCodeLookUp.js');
const { getLineNumber } = require('../../getLineNumber');

// logic for if lang attributes have valid values
function langIsValid() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const ludwig = window.document;
    const set = new Set();

    const html = ludwig.querySelector('html');
    const lang = html.getAttribute('lang');

    console.log('HERE:', langCodes[lang]);
    if (!langCodes[lang]) {
      const lineNumber = getLineNumber(activeEditor.document, html.outerHTML, set);
      set.add(lineNumber);
      return [html, lineNumber];
    }
  }
}

module.exports = {
  langIsValid,
};
