const vscode = require('vscode');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = require('jsdom');

// const htmlCode = `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8" />
//     <title>Sample Title</title>
//   </head>
//   <body>
//     <header aria-hidden="true">This is the header!</header>
//     <div class="link container">
//       <a href="https://www.example.com">Click me</a>
//       <a aria-label="tag-2" href="https://www.example.com">Click me</a>
//       <a aria-label="Click me" href="https://www.example.com">Click me</a>
//     </div>
//     <div id="duplicate">Something</div>
//     <input id="duplicate" type="button">
//     <div>GorbleGorble</div>
//     <button name='button'>clickclickclick</button>
//   </body>
// </html>
// `;

// // default message with specific aria-fail found and link to docs
// const defaultMsg = {};

// logic for if anchors have a label
function evalAnchors() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;
  
    const anchors = ludwig.querySelectorAll('a');
    // console.log('anchors ', anchors);

    // push missing anchors into array, like you mentioned below
    const anchorsWithoutAriaLabel = [];

    anchors.forEach((link, index) => {
      const ariaLabel = link.getAttribute('aria-label');

      // could push missing anchors into an object for more intentional use 
      // could inlcude logic to make sure the aria-label matches content 
      if (!ariaLabel) {
        console.log(`Link ${index + 1} is missing aria-label`);
        anchorsWithoutAriaLabel.push(link.outerHTML); // push here
      }
    });
    return anchorsWithoutAriaLabel; // return that array
  }
}

// export to extension.ts

module.exports = {
  evalAnchors
};