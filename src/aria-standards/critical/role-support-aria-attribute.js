const e = require('express');
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
    <header aria-hidden="true" role="heading">This is the header!</header>
    <div class="link container" role="menubar">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <div id="duplicate">Something</div>
    <input id="duplicate" type="button" role="button">
    <div>GorbleGorble</div>
    <button name='button' role='button'>clickclickclick</button>
  </body>
</html>
`;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

// default message with specific aria-fail found and link to docs
const defaultMsg = {};

// check to see if an element’s role supports its ARIA attributes
function checkAriaRoles() {
  // compile all html elements into node list
  const allElement = ludwig.querySelectorAll('*');
  console.log(allElement);

  // extract roles from every element
  // what to do if role does not exist? 
  const elementRoles = [];
  allElement.forEach((el) => {
    const item = [el.nodeName];
    const role = el.getAttribute('role');
    item.push(role);
    elementRoles.push(item);
  });
  console.log(elementRoles);
  
  // iterate through elementRoles, checking role against type according to guidelines on: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles



}

checkAriaRoles();