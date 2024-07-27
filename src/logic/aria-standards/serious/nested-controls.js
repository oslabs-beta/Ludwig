const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function checkNestedInteractiveControls() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;

    const nestedInteractiveControls = [];
    const set = new Set();
    const interactiveControlElements = document.querySelectorAll(
      'button, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [contenteditable="true"]'
    );

    interactiveControlElements.forEach((interactiveControlElement) => {
      const lineNumber = getLineNumber(activeEditor.document, interactiveControlElement.outerHTML, set);
      set.add(lineNumber);
      // const lineNumber = activeEditor.document.positionAt(interactiveControlElement.startOffset).line
      const isNested =
        Array.from(
          interactiveControlElement.querySelectorAll(
            'button, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [contenteditable="true"]'
          )
        ).length > 1;

      if (isNested) {
        nestedInteractiveControls.push(interactiveControlElement.outerHTML);
      }
    });

    return nestedInteractiveControls;
  }
}

module.exports = {
  checkNestedInteractiveControls,
};
