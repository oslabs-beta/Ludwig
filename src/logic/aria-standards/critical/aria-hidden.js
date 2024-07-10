const { getLineNumber } = require('../../getLineNumber');

function checkAriaHidden(nodes) {

  const recs = [];

  nodes.forEach((node) => {

    if (node.getAttribute('aria-hidden') === 'true') {

      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });
  
  return recs;
};

module.exports = {
  checkAriaHidden
};