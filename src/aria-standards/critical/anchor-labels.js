const vscode = require('vscode');
const { JSDOM } = require('jsdom');

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
      const lineNumber = activeEditor.document.positionAt(link.startOffset).line;
      const ariaLabel = link.getAttribute('aria-label');

      // could push missing anchors into an object for more intentional use 
      // could inlcude logic to make sure the aria-label matches content 
      if (!ariaLabel) {
        // console.log(`Link ${index + 1} is missing aria-label`);
        anchorsWithoutAriaLabel.push([link.outerHTML, lineNumber]); // push here
      }
    });
    return anchorsWithoutAriaLabel; // return that array
  }
}


// export to extension.ts

module.exports = {
  evalAnchors
};