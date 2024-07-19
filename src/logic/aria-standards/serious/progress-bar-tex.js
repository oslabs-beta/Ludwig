const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function checkProgressBars() {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;
    const progressBarsToHighlight = [];
    const set = new Set();
    // Get all elements with role="progressbar"
    const progressBars = document.querySelectorAll('[role="progressbar"]');

    // Iterate through each progress bar
    progressBars.forEach((progressBar) => {
      const lineNumber = getLineNumber(activeEditor.document, progressBar.outerHTML, set);
      set.add(lineNumber);
      // const lineNumber = activeEditor.document.positionAt(progressBar.startOffset).line;
      // Check if the progress bar has children
      const children = progressBar.children;

      if (children.length > 0) {
        // Check if at least one child has text content
        const hasTextContent = Array.from(children).some((child) => {
          return child.textContent.trim().length > 0;
        });
        if (!hasTextContent) {
          progressBarsToHighlight.push([progressBar.outerHTML, lineNumber]);
        }
      } else {
        progressBarsToHighlight.push([progressBar.outerHTML, lineNumber]);
      }
    });
    return progressBarsToHighlight;
  }
}

module.exports = {
  checkProgressBars,
};
