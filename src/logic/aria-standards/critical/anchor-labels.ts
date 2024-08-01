const { getLineNumber } = require('../../getLineNumber');

export function anchorLabelCheck(nodes: any[]) {
  const recs: any[][] = []; // Array to store line number and HTML of nodes without aria-label

  nodes.forEach((node: any) => {
    // Get aria-label and aria-labelledby attributes of current node
    const ariaLabel: any = node.getAttribute('aria-label');
    const ariaLabelledBy: any = node.getAttribute('aria-labelledby');

    // If node does not have aria-label or aria-labelledby attributes, add its line number and HTML to recs array
    if (!ariaLabel && !ariaLabelledBy) {
      const lineNumber = getLineNumber(node);
      if (lineNumber) recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}
