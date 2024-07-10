const { getLineNumber } = require('../../getLineNumber');

export function videoCaptionsCheck(nodes: any[]) {
  const recs: any[][] = [];

  nodes.forEach((node) => {
    const track = node.querySelector('track');

    if (
      !track ||
      !track.getAttribute('kind')
      // || !track.getAttribute('kind') === 'captions' ||
      // !track.getAttribute('kind') === 'subtitles'
    ) {
      const lineNumber = getLineNumber(node);

      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}
