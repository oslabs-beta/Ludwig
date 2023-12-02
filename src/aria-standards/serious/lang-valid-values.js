// const vscode = require('vscode');
const { JSDOM } = require('jsdom');

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sample Title</title>
  </head>
  <body>`;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

// logic for if lang attributes have valid values
function langIsValid() {
  // const activeEditor = vscode.window.activeTextEditor;

  // if (activeEditor && activeEditor.document.languageId === 'html') {
  //   const htmlCode = activeEditor.document.getText();
  //   const { window } = new JSDOM(htmlCode);
  //   const document = window.document;
  //   const ludwig = document.body;
  
    const lang = document.querySelector('html');
    console.log('LANG:', lang);


  // }
}

console.log(langIsValid());

// export to extension.ts
module.exports = {
  langIsValid
};