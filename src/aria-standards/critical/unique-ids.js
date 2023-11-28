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

// check that all ids in doc are unique
function checkUniqueIds() {
  const idSet = new Set();
  const duplicateElements = [];

  const elementsWithId = ludwig.querySelectorAll('[id]');
  
  elementsWithId.forEach(element => {
    const id = element.id;

    if (idSet.has(id)) {
      console.error(`Duplicate id found: ${id}`);
      // Store the element with duplicate id in the array
      duplicateElements.push(element.outerHTML);
    } else {
      idSet.add(id);
    }
  });

  if (duplicateElements.length > 0) {
    console.log('Elements that duplicate ids:');
    duplicateElements.forEach((element, index) => {
      console.log(`Element ${index + 1}:`);
      console.log(element);
    });
  } else {
    console.log('No duplicate ids found.');
  }
}