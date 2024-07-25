const { getLineNumber } = require('../../getLineNumber');

// <input type=”image”> elements have alternative text
export function imageAltsCheck(nodes: any[]) {
  const recs: any[][] = [];

  nodes.forEach((node) => {
    const altText = node.getAttribute('alt');
    const ariaLabel = node.getAttribute('aria-label');
    const ariaLabelledby = node.getAttribute('aria-labelledby');

    if (!altText && !ariaLabel && !ariaLabelledby) {
      const lineNumber = getLineNumber(node);

      if (lineNumber) recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}
