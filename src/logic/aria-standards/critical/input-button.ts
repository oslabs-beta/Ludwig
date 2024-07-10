const { getLineNumber } = require('../../getLineNumber');

// input button has discernible text
export function inputButtonCheck(nodes: any[]) {
  const recs: any[][] = [];

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
