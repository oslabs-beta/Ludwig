const vscode = require('vscode');
const { JSDOM } = require('jsdom');

// check that <marquee> elements are not used
function checkMarquee() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const marquee = ludwig.querySelectorAll('marquee');

    return marquee.length > 0 ? marquee : undefined;
  }
}

module.exports = {
  checkMarquee
};