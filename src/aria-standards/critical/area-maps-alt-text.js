const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = require('jsdom');

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sample Title</title>
  </head>
  <body>
    <header aria-hidden="true">This is the header!</header>
    <div class="link container">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <map>
      <area shape="rect" coords="0,0,30,30"
      href="reference.html" alt="Reference">
      <area shape="rect" coords="34,34,100,100"
      href="media.html" alt="Audio visual lab">
    </map>
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

// <area> elements of image maps have alternate text
function checkAreaMapAltText() {
  const areas = ludwig.querySelectorAll('area');
  console.log(areas);
  
  // check if each el has alt text
  areas.forEach((el, i) => {
    const altText = el.getAttribute('alt');
    console.log('alt text', altText);

    if (!altText) {
      console.log(`Area map ${i + 1} is missing alt text`);
    }
  });

}