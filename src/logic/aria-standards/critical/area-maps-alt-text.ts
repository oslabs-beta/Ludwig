const { getLineNumber } = require('../../getLineNumber');

// <area> elements of image maps have alternate text
export function areaAltTextCheck(nodes: any[]) {
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

module.exports = {
  areaAltTextCheck,
};
