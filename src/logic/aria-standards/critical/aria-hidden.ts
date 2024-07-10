const { getLineNumber } = require('../../getLineNumber');

export function ariaHiddenCheck(nodes: any[]) {
  const recs: any[][] = [];

  nodes.forEach((node) => {
    if (node.getAttribute('aria-hidden') === 'true') {
      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}
