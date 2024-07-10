const { getLineNumber } = require('../../getLineNumber');

function selectName(nodes) {
  const recs = [];

  nodes.forEach((node) => {

    const ariaLabel = node.getAttribute('aria-label');
    const ariaLabelledBy = node.getAttribute('aria-labelledby');

    if (!ariaLabel && !ariaLabelledBy) {

      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}

module.exports = {
  selectName
};