const { getLineNumber } = require('../../getLineNumber');

// buttons have discernible text
export function discernibleButtonTextCheck(nodes: any[]) {
  const recs: any[][] = [];

  nodes.forEach((node) => {
    if (
      !node.innerText &&
      !node.getAttribute('aria-label') &&
      !node.getAttribute('aria-labelledby') &&
      !node.getAttribute('title')
    ) {
      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}
