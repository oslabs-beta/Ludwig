const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = require('jsdom');

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sample Title</title>
    <meta http-equiv="refresh" content="0; URL=https://planet-express.example.com">
  </head>
  <body>
  <img src='someurlhere.com' alt='a cute photo' />
    <header aria-hidden="true">This is the header!</header>
    <div class="link container">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <div id="duplicate">Something</div>
    <input id="duplicate" type="button">
    <div>GorbleGorble</div>
    <button name='button' text ="Hello There"></button>
  </body>
</html>
`;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

// default message with specific aria-fail found and link to docs
const defaultMsg = {};

// <meta name=”viewport”> does not disable text scaling and zooming
function checkMetaViewportTextResize() {
  const meta = document.querySelectorAll('meta');
  console.log(meta);
  
  // check if each el has the attribute name with the value "viewport"
  meta.forEach((el, i) => {
    const name = el.getAttribute('name');
    console.log('name', name);

    if (name === 'viewport') {
      // make sure that text zooming/scaling has not been disabled
      if () {
        console.log(`Meta with attribute name="viewport" ${i + 1} should not disable text resizing`);
      }
    };
  });
}

checkMetaViewportTextResize();