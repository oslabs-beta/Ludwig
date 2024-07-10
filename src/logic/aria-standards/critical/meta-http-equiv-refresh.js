const { getLineNumber } = require('../../getLineNumber');

// remove the http-equiv="refresh" attribute from each meta element in which it is present or
// increase the refresh time to be greater than 20 hours

function checkMetaHttpRefresh(nodes) {

  const recs = [];

  nodes.forEach((node) => {

    const httpEquiv = node.getAttribute('http-equiv');
    const content = Number(node.getAttribute('content'));

    if (httpEquiv === 'refresh' && content <= 72000) {

      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}

module.exports = {
  checkMetaHttpRefresh
};