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

    anchors.forEach((link, index) => {
      // const lineNumber = activeEditor.document.positionAt(link.startOffset).line;
      const ariaLabel = link.getAttribute('aria-label');

      // could push missing anchors into an object for more intentional use 
      // could inlcude logic to make sure the aria-label matches content 
      if (!ariaLabel) {
        // console.log(`Link ${index + 1} is missing aria-label`);
        anchorsWithoutAriaLabel.push(link.outerHTML); // push here
      }
    });
    
    return anchorsWithoutAriaLabel; // return that array
  }
  // else if (activeEditor && activeEditor.document.languageId === 'javascriptreact') {
  //   const jsxCode = activeEditor.document.getText();

  //   // use Babel parser to parse JSX code
  //   const ast = parser.parse(jsxCode, {
  //     sourceType: 'module',
  //     plugins: ['jsx'],
  //   });

  //   // Traverse the AST to extract JSX expressions
  //   const jsxExpressions = [];
  //   traverse(ast, {
  //     JSXElement(path) {
  //       jsxExpressions.push(path.toString());
  //     },
  //   });

  //   // Convert JSX expressions to JavaScript code
  //   const jsCode = jsxExpressions.join('');

  //   // Use JSDOM to parse the JavaScript code as HTML
  //   const { window } = new JSDOM(jsCode);
  //   const document = window.document;
  //   const ludwig = document.body;

  //   const anchors = ludwig.querySelectorAll('a');

  //   // push missing anchors into array, like you mentioned below
  //   const anchorsWithoutAriaLabel = [];

  //   anchors.forEach((link, index) => {
  //     const ariaLabel = link.getAttribute('aria-label');

  //     // could push missing anchors into an object for more intentional use
  //     // could include logic to make sure the aria-label matches content
  //     if (!ariaLabel) {
  //       // console.log(`Link ${index + 1} is missing aria-label`);
  //       anchorsWithoutAriaLabel.push(link.outerHTML); // push here
  //     }
  //   });
  //   return anchorsWithoutAriaLabel; // return that array
  // }
}


// export to extension.ts

module.exports = {
  evalAnchors
};