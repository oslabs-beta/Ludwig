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
  <img src='someurlhere.com' alt='a cute photo' />
    <header aria-hidden="true">This is the header!</header>
    <div class="link container">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <img src="../images/animal.jpg" />
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

// <input type=”image”> elements have alternative text
function checkImgAltText() {
  // const images = ludwig.images; <-- returns html collection
  // const images = ludwig.getElementsByTagName("img"); <-- returns html collection
  const img = ludwig.querySelectorAll('img');
  // console.log('images', img);

  img.forEach((img, index) => {
    const altText = img.getAttribute('alt');
    console.log('alt text', altText);

    if (!altText) {
      console.log(`Img ${index + 1} is missing alt text`);
    }
  });

}

// checkImgAltText();