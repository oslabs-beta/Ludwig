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

checkUniqueIds();

// input button has discernible text
function inputButtonText() {
  const input = ludwig.querySelectorAll('input');
  
  // check that value is not an empty string or missing
  input.forEach((el, index) => {
    if (el.value === '' || !el.value) {
      console.log(`Input Button ${index + 1} does not have a value.`);
    }
  });
}

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

  // buttons.forEach((el, index) => {
  //   if(el.hasAttributes()) {
  //     const bttnAttr = el.getAttributeNames();
  //     console.log(bttnAttr);

  //   }


    // if (el.innerHTML === '' || el.innerText === '' || !el.innerHTML || !el.innerText) {
    //   console.log(`Button ${index + 1} does not contain text indicating it's function.`);
    // }
    
}


checkButtonText();