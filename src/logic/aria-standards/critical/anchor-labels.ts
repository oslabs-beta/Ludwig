const { getLineNumber } = require('../../getLineNumber');

// logic for if anchors have an aria-label
export function anchorLabelCheck(nodes: any[]) {
  const recs: any[][] = [];

  nodes.forEach((node: any) => {
    const ariaLabel: any = node.getAttribute('aria-label');
    const ariaLabelledBy: any = node.getAttribute('aria-labelledby');

    if (!ariaLabel && !ariaLabelledBy) {
      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}
