// needs testing. If it works, move to critical
const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function allLabelsHaveText(htmlTest) {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const labelsForRevision = [];
    const set = new Set();
    const elementsWithAriaAttributes = document.querySelectorAll(
      '[aria-activedescendant], [aria-atomic], [aria-autocomplete], [aria-busy], [aria-checked], [aria-colcount], [aria-colindex], [aria-colspan], [aria-controls], [aria-current], [aria-describedby], [aria-details], [aria-disabled], [aria-dropeffect], [aria-errormessage], [aria-expanded], [aria-flowto], [aria-grabbed], [aria-haspopup], [aria-hidden], [aria-invalid], [aria-keyshortcuts], [aria-label], [aria-labelledby], [aria-level], [aria-live], [aria-modal], [aria-multiline], [aria-multiselectable], [aria-orientation], [aria-owns], [aria-placeholder], [aria-posinset], [aria-pressed], [aria-readonly], [aria-relevant], [aria-required], [aria-roledescription], [aria-rowcount], [aria-rowindex], [aria-rowspan], [aria-selected], [aria-setsize], [aria-sort], [aria-valuemax], [aria-valuemin], [aria-valuenow], [aria-valuetext]'
    );

    // look through and check each aria tag for missing text
    elementsWithAriaAttributes.forEach((tag) => {
      // const lineNumber = activeEditor.document.positionAt(tag.startOffset).line;
      const attributes = tag.attributes;
      const lineNumber = getLineNumber(activeEditor.document, tag.outerHTML, set);
      set.add(lineNumber);

      for (let i = 0; i < attributes.length; i++) {
        const currAttr = attributes[i].name;
        if (currAttr.indexOf('aria') === 0) {
          labelsForRevision.push([tag.outerHTML, lineNumber]);
        }
      }
    });
    return labelsForRevision;
  }
}

module.exports = {
  allLabelsHaveText,
};
