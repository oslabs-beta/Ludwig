const { getLineNumber } = require('../../getLineNumber');

// <meta name=”viewport”> does not disable text scaling and zooming
function checkMetaViewportTextResize(nodes) {

  const recs = [];

  nodes.forEach((node) => {

    const content = node.getAttribute('content');
    let maxScale;
    let userScale;

    if (content.includes('maximum-scale')) {
      const i = content.indexOf('maximum');
      maxScale = content.slice(i, i + 16).trimEnd();
      maxScale = Number(maxScale.split('=')[1].trim());
    }

    if (content.includes('user-scalable')) {
      const i = content.indexOf('user-');
      userScale = content.slice(i, i+17).trimEnd();
      userScale = userScale.split('=')[1].trim();
    }

    if (maxScale < 2 || userScale === 'no' || userScale === '0') {
      const lineNumber = getLineNumber(node);
      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}

module.exports = {
  checkMetaViewportTextResize
};
