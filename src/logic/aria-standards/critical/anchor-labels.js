const { getLineNumber } = require('../../getLineNumber');

// logic for if anchors have an aria-label
function anchorLabelCheck(nodes) {

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
  anchorLabelCheck
};