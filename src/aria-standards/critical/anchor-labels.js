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
    <div id="duplicate">Something</div>
    <input id="duplicate" type="button">
    <div>GorbleGorble</div>
    <button name='button'>clickclickclick</button>
  </body>
</html>
`;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

// default message with specific aria-fail found and link to docs
const defaultMsg = {};

// logic for if anchors have a label
function evalAnchors() {
  const anchors = ludwig.querySelectorAll('a');
  console.log('anchors ', anchors);

  anchors.forEach((link, index) => {
    const ariaLabel = link.getAttribute('aria-label');

    // could push missing anchors into an object for more intentional use 
    // could inlcude logic to make sure the aria-label matches content 
    if (!ariaLabel) {
      console.log(`Link ${index + 1} is missing aria-label`);
    }
  });
}