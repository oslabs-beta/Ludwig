// needs testing. If it works, move to critical
const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function htmlHasTitle(htmlTest) {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const tagForRevision = [];
    const set = new Set();
    const headEle = document.querySelector('head');
    const title = headEle.querySelector('title');
    const hasTitle = title && title.textContent;
    // const lineNumber = activeEditor.document.positionAt(title.startOffset).line;

    if (!hasTitle) {
      const lineNumber = getLineNumber(activeEditor.document, headEle.outerHTML, set);
      set.add(lineNumber);
      tagForRevision.push([headEle.outerHTML, lineNumber]);
    }

    // look through and check each aria tag for missing text

    return tagForRevision;
  }
}

module.exports = {
  htmlHasTitle,
};
