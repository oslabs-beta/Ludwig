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

// Logic for aria-hidden="true"
function checkAriaHidden() {

  const allElement = ludwig.querySelectorAll('*');

  const hiddenElements = Array.from(allElement).filter(element => {
    const ariaHiddenAtt = element.getAttribute('aria-hidden');
    return ariaHiddenAtt === 'true';
  });

  if (hiddenElements.length > 0) {
      console.log('The following tags have ARIA hidden:');
      hiddenElements.forEach((element, index) => {

      console.log(`Element ${index + 1}, ${element.outerHTML}`);
    });
  } else {
    console.log('Your elements have no hidden ARIA attributes. Great work!');
  }
};