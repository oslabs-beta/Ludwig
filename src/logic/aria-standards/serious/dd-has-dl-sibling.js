const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function dTagsHaveSib(htmlTest) {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const tagForRevision = [];
    const set = new Set();

    const dtTags = document.querySelectorAll('dt');
    const dtTagsArray = Array.from(dtTags);
    const ddTags = document.querySelectorAll('dd');
    const ddTagsArray = Array.from(ddTags);

    // tags should be in pairs, so array lengths should be even
    // needs set func?
    if (dtTagsArray.length !== ddTagsArray.length) {
      tagForRevision.push(dtTagsArray[0]);
      tagForRevision.push(ddTagsArray[0]);
    }

    return tagForRevision;
  }
}

module.exports = {
  dTagsHaveSib,
};
