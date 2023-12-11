const { JSDOM } = require('jsdom');

const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
  <frame aria-label="Tyler"> Tyler </frame>
  <frame aria-labelledby="Prashay" > Prashay  </frame>
  <iframe title="true" name="true"> True  </iframe>
  <iframe title="true" name="true"> True  </iframe>
</body>
</html>`;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

function hasTitleTag() {
  const tagForRevision = [];
  const frames = ludwig.querySelectorAll('frame, iframe');

  frames.forEach((tag) => {
    const title = tag.getAttribute('title');
    const tableIndex = parseInt(tag.getAttribute('tabindex') || 0, 10);
    const name = tag.getAttribute('name');
    console.log('name', name);

    if (name === null || !title || tableIndex === -1) {
      tagForRevision.push(tag.outerHTML);
    }
  });

  return tagForRevision;
}


console.log(hasTitleTag(htmlCode));