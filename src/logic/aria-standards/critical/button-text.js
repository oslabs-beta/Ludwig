const { getLineNumber } = require('../../getLineNumber');

// buttons have discernible text
function checkButtonText(nodes) {

    const recs = [];

    nodes.forEach((node) => {
      
      if (!node.innerText && 
        !node.getAttribute('aria-label') &&
        !node.getAttribute('aria-labelledby') &&
        !node.getAttribute('title')) {

        const lineNumber = getLineNumber(node);

        recs.push([lineNumber, node.outerHTML]);
      }

    });

    return recs;
}

module.exports = {
  checkButtonText
};
