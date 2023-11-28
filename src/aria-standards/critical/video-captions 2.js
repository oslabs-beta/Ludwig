
const vscode = require('vscode');
const { JSDOM } = require('jsdom');

function videoCaptions() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;
  
  const videosArray = [];
  
  const videos = ludwig.querySelectorAll('video');

  videos.forEach((video, index) => {
    // Check if the video has a captions track
    let captions = video.querySelector('track[kind="captions"]');
    let label = captions.getAttribute('label');
    let source = captions.getAttribute('src');

    if (!captions || !label || !source) {
      videosArray.push(video.outerHTML);
    }

  });
  return videosArray;
}
}

module.exports = {
  videoCaptions
}
