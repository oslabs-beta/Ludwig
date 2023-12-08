const vscode = require('vscode');
const { JSDOM } = require('jsdom');

// check that doc has a lang attribute
function containsLangAttr() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const ludwig = window.document;

    const html = ludwig.querySelector('html');
    const lang = ludwig.querySelector('html[lang]');
    
    if (!lang) {
      return html;
    }
    
  }
}

module.exports = {
  containsLangAttr
};