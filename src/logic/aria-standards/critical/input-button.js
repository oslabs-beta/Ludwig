const { getLineNumber } = require('../../getLineNumber');

// input button has discernible text
function inputButtonText(nodes) {

  const recs = [];

  nodes.forEach((node) => {

    const value = node.getAttribute('value');
    const title = node.getAttribute('title');
    const ariaLabel = node.getAttribute('aria-label');
    const ariaLabelledBy = node.getAttribute('aria-labelledby');

    if (!value && !title && !ariaLabel && !ariaLabelledBy) {

      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}

module.exports = {
  inputButtonText
};