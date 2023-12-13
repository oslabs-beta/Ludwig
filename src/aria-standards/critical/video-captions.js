const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');


function videoCaptions() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;
  
  const videosArray = [];
  const set = new Set();
  
  const videos = ludwig.querySelectorAll('video');

  videos.forEach((video, index) => {

    // Check if the video has a captions track
    let track = video.querySelector('track');
    let label;
    let source;
    if (track.getAttribute('kind') === 'subtitles' || track.getAttribute('kind') === 'captions') {
      label = track.getAttribute('label');
      source = track.getAttribute('src');
    }
    const lineNumber = getLineNumber(activeEditor.document, track.outerHTML, set);
    set.add(lineNumber);
    if (!track || !label || !source) {
      videosArray.push([track.outerHTML, lineNumber]);
    }

  });
  return videosArray;
}
}

module.exports = {
  videoCaptions
};
