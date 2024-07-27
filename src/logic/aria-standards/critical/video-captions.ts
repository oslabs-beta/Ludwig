const { getLineNumber } = require('../../getLineNumber');

export function videoCaptionsCheck(nodes: any[]) {
  const recs: any[][] = [];

  nodes.forEach((node) => {
    const track = node.querySelector('track');

    if (!track || !track.getAttribute('kind')) {
      const lineNumber = getLineNumber(node);

      if (lineNumber) recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}
