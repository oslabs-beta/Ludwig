const vscode = require('vscode');
const { JSDOM } = require('jsdom');

// <meta name=”viewport”> does not disable text scaling and zooming
function checkMetaViewportTextResize() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    const meta = document.querySelectorAll('meta[name="viewport"]');
    // console.log('meta tag' , meta);
    const metaViewportElements = [];
    
    // check if each el has the attribute name with the value "viewport"
    meta.forEach((el, i) => {
      const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
      const name = el.getAttribute('name');
      // console.log('name', name);
      // extract content string using get attribute
      const content = el.getAttribute('content');
      // console.log('content', content, typeof content);
      // get attr of maximum-scale, any value less than 3 fails accessibility
      let maxScale;
      if (content.includes('maximum-scale')) {
        const i = content.indexOf('maximum');
        maxScale = content.slice(i, i+16).trimEnd();
        maxScale = Number(maxScale.split('=')[1].trim());
      }
      // controls whether zoom in or zoom out is allowed on page; value 0 or no is NOT accessible
      let userScale;
      if (content.includes('user-scalable')) {
        const i = content.indexOf('user-');
        userScale = content.slice(i, i+17).trimEnd();
        userScale = userScale.split('=')[1].trim();
      }
      if (name === 'viewport') {
        // make sure that text zooming/scaling has not been disabled
        if (maxScale < 3 || userScale === 'no' || userScale === '0') {
          metaViewportElements.push([el.outerHTML, lineNumber]);
          // console.log(`Meta with attribute name="viewport" ${i + 1} should not disable text resizing`);
        }
      };
    });
    return metaViewportElements;
  }
}

module.exports = {
  checkMetaViewportTextResize
};
