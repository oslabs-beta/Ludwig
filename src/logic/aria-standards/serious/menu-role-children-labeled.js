const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

function menuRoleChildrenLabeled(htmlTest) {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const childrenForRevision = [];
    const set = new Set();
    const menuParent = ludwig.querySelector('[role="menu"]');

    if (menuParent) {
      const children = menuParent.children;
      // html collection spread into array
      children.forEach((ele) => {
        const lineNumber = getLineNumber(activeEditor.document, ele.outerHTML, set);
        set.add(lineNumber);
        // const lineNumber = activeEditor.document.positionAt(ele.startOffset).line;
        if (!ele.getAttribute('role')) {
          childrenForRevision.push([ele.outerHTML, lineNumber]);
        }
      });
    }
    return childrenForRevision;
  }
}

module.exports = {
  menuRoleChildrenLabeled,
};
