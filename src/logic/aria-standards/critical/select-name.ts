const { getLineNumber } = require('../../getLineNumber');

export function selectHasAccessNameCheck(nodes: any[]) {
  const recs: any[][] = [];

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
