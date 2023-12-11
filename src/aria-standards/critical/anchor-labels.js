const vscode = require('vscode');
const { JSDOM } = require('jsdom');
// const parser = require('@babel/parser');
// const traverse = require('@babel/traverse').default;

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
    const set = new Set();

    anchors.forEach((link, index) => {
      // const lineNumber = activeEditor.document.positionAt(link.startOffset).line;
      const ariaLabel = link.getAttribute('aria-label');

      // could push missing anchors into an object for more intentional use 
      // could inlcude logic to make sure the aria-label matches content 
      const lineNumber = getLineNumber(activeEditor.document, link, set);
      set.add(lineNumber);
      if (!ariaLabel) {

        console.log(lineNumber);
        // console.log(`Link ${index + 1} is missing aria-label`);
        anchorsWithoutAriaLabel.push([link.outerHTML, lineNumber]); // push here
      }
    });
    
    return anchorsWithoutAriaLabel; // return that array
  }
}

function getLineNumber(document, node, set) {
  const htmlCode = document.getText();
  const lines = htmlCode.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if(!set.has(i + 1)){
      const line = lines[i];
      const indexInLine = line.indexOf(node.outerHTML);
  
      if (indexInLine !== -1) {
        return i + 1;
      }
    }
  }
}


// export to extension.ts

module.exports = {
  evalAnchors
};