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
    <form>
      <label for="firstname">First name:</label>
      <input type="text" name="firstname" id="firstname">
    </form>
    <div>Something</div>
    <div>GorbleGorble</div>
    <button>clickclickclick</button>
    <form>
      <label for="test">First name:</label>
      <input type="text" name="firteststname" id="test">
      <label for="test2">First name:</label>
      <input type="text" name="firteststname" id="test1">
    </form>
  </body>
</html>
`;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

console.log(ludwig.innerHTML);

// default message with specific aria-fail found and link to docs
const defaultMsg = {};

function checkLabels() {
  const formArray = [];
  const forms = ludwig.querySelectorAll('form');
  console.log(forms);
  const labels = ludwig.querySelectorAll('label'); //collection of all elements in the body with a label tag.
  console.log(labels);
  const inputs = ludwig.querySelectorAll('input'); //collection of all elements in the body with a input tag
  console.log(inputs);

  forms.forEach((form) => {
    const formChildren = form.children;
    console.log(formChildren);
    const labelsArray = [];
    const inputsArray = [];
    for (const child of formChildren) {
      console.log(child.tagName);
      if (child.tagName === 'LABEL') {
        labelsArray.push(child);
      }
      if (child.tagName === 'INPUT') {
        inputsArray.push(child);
      }
    }
    console.log(labelsArray);
    console.log(inputsArray);
    for (let i = 0; i < labelsArray.length; i++) {
      console.log(labelsArray[i]);
      const inputId = inputsArray[i].getAttribute('id');
      const labelFor = labelsArray[i].getAttribute('for');
      if (inputId === labelFor) {
        console.log(`Label ${labelFor} matches Input ${inputId}`);
      } else {
        console.log(`Label ${labelFor} DOES NOT match Input ${inputId}`);
        formArray.push(form.outerHTML);
      }
    }
  });
  return formArray;
}

console.log(checkLabels());
