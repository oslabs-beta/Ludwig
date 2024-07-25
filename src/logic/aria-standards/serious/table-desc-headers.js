const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// <th> elements and elements with role=columnheader OR role=rowheader have data cells they describes
function checkTableHeaders() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // output array for fail cases
    const incorrectTableHeaders = [];
    const set = new Set();

    const th = ludwig.querySelectorAll('th');
    // Check that all th elements have a scope attribute.
    // Check that all scope attributes have the value row, col, rowgroup, or colgroup.
    th.forEach((el) => {
      const lineNumber = getLineNumber(activeEditor.document, switchElement.outerHTML, set);
      set.add(lineNumber);
      const scope = el.getAttribute('scope');
      if (!scope || (scope !== 'row' && scope !== 'col' && scope !== 'rowgroup' && scope !== 'colgroup')) {
        incorrectTableHeaders.push([el, lineNumber]);
      }
    });

    // Check that all td elements that act as headers for other elements have a scope attribute.
    // check for any td elements with role=columnheader OR role=rowheader
    const td = ludwig.querySelectorAll('td');
    const tableHeaderRoles = [];
    td.forEach((el) => {
      const role = el.getAttribute('role');
      if (role === 'columnheader' || role === 'rowheader') {
        tableHeaderRoles.push(el);
      }
    });
    tableHeaderRoles.forEach((el) => {
      const lineNumber = getLineNumber(activeEditor.document, el.outerHTML, set);
      set.add(lineNumber);
      const scope = el.getAttribute('scope');
      if (!scope || (scope !== 'row' && scope !== 'col' && scope !== 'rowgroup' && scope !== 'colgroup')) {
        incorrectTableHeaders.push([el, lineNumber]);
      }
    });

    return incorrectTableHeaders;
  }
}

// export to extension.ts
module.exports = {
  checkTableHeaders,
};
