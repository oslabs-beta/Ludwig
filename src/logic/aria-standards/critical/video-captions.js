const { getLineNumber } = require('../../getLineNumber');

function videoCaptions(nodes) {

  const recs = [];

  nodes.forEach((node) => {
    
    const track = node.querySelector('track');
    
    if (!track ||
      !track.getAttribute('kind') ||
      !track.getAttribute('kind') === 'captions' ||
      !track.getAttribute('kind') === 'subtitles') {
      
      const lineNumber = getLineNumber(node);
      
      recs.push([lineNumber, node.outerHTML]);
    }
  });

  return recs;
}

module.exports = {
  videoCaptions
};
