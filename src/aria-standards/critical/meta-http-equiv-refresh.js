const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');


// <meta http-equiv=”refresh”> is not used for delayed refresh
function checkMetaHttpRefresh() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const meta = document.querySelectorAll('meta');
    // console.log(meta);

    const metaWrongContent = [];
    const set = new Set();
    
    // check if each el has http-equiv attribute
    meta.forEach((el, i) => {
      const httpEquiv = el.getAttribute('http-equiv');
      // console.log('http-equiv', httpEquiv);
      // each content attr must have a value that has a number that is 0
      const content = el.getAttribute('content');
      // console.log('content', content);

      if (httpEquiv === 'refresh') {
        const lineNumber = getLineNumber(activeEditor.document, el, set);
        set.add(lineNumber);
        // if content does not exist, does not begin with the number 0 or is not followed by "URL="
        if (!content || content[0] !== '0' || !content.includes('URL=')) {
          metaWrongContent.push([el.outerHTML, lineNumber]);
          // console.log(`Http-equiv ${i + 1} does not have the correct content`);
        }
      };
    });
    return metaWrongContent;
  }
}

module.exports = {
  checkMetaHttpRefresh
};