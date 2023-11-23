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

// buttons have discernible text
function checkButtonText() {
  const buttons = ludwig.querySelectorAll('button');
  console.log(buttons);

  // check innerHTMl or innerText to make sure it is not missing or an empty string
  buttons.forEach((el, i) => {
    if (el.innerHTML === '') {
      console.log(`Button ${index + 1} does not contain inner html indicating it's function.`);
    } else if (el.innerText === '') {
      console.log(`Button ${index + 1} does not contain inner text indicating it's function.`);
    } else {
      //// ???
    }
  });

}


checkButtonText();