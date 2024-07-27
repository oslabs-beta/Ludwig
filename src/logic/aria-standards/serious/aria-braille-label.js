const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// test HTML
/*
`<div role="button" aria-braillelabel="">
Click me
</div>

<!-- aria-braillelabel with the same value as the element tag name -->
<button role="button" aria-braillelabel="button">
Click me
</button>

<!-- Correctly formatted aria-braillelabel -->
<div role="button" aria-braillelabel="Click to interact">
Click me
</div>`
*/

// logic for if anchors have a label
function ariaBrailleLabel(htmlTest) {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const brailleElements = ludwig.querySelectorAll('[aria-braillelabel]');

    const brailleEleForRevision = [];
    const set = new Set();

    brailleElements.forEach((ele, index) => {
      // const lineNumber = activeEditor.document.positionAt(ele.startOffset).line;
      const ariaBrailleLabel = ele.getAttribute('aria-braillelabel');

      // could push missing anchors into an object for more intentional use
      // could inlcude logic to make sure the aria-label matches content
      const lineNumber = getLineNumber(activeEditor.document, ele.outerHTML, set);
      set.add(lineNumber);
      if (!ariaBrailleLabel || ariaBrailleLabel === ele.tagName) {
        // console.log(`Link ${index + 1} is missing aria-label`);
        brailleEleForRevision.push([ele.outerHTML, lineNumber]); // push here
      }
    });
    return anchorsWithoutAriaLabel; // return that array
  }
}

// export to extension.ts

module.exports = {
  ariaBrailleLabel,
};
