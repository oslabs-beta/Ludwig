const vscode = require('vscode');
const { JSDOM } = require('jsdom');

// const htmlCode = `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8" />
//     <title>Sample Title</title>
//   </head>
//   <body>`;

// const { window } = new JSDOM(htmlCode);
// const ludwig = window.document;

// check that doc has a lang attribute
function containsLangAttr() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const ludwig = window.document;

    const html = ludwig.querySelector('html');
    const lang = ludwig.querySelector('html[lang]');
    console.log('lang:', lang);
    
    if (!lang) {
      return html;
    }
    
  }
}
// console.log(containsLangAttr());

module.exports = {
  containsLangAttr
};