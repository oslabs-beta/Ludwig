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
    <div role="toolbar">
      <p>A tip!</p>
      <p>Another tip.</p>
      <p>More tips!!</p>
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
  // console.log(allElement);

  // add lineNumber variable - pass in document to figure out line logic

  // array to hold output of the line numbers of failed html tests  
  const roleSupportLines = [];

  // extract roles from every element
  // what to do if role does not exist? 
  const elementRoles = [];
  allElement.forEach((el) => {
    const item = [el.nodeName, el.parentNode, el.children];
    const role = el.getAttribute('role');
    item.push(role);
    elementRoles.push(item);
  });
  console.log(elementRoles);
  
  // iterate through elementRoles, checking role against type according to guidelines on: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles

  elementRoles.forEach((arr) => {
    const el = arr[0];
    const parent = arr[1];
    const children = arr[2];
    const role = arr[3];

    switch (role) {

  // DOM STRUCTURE
  // toolbar role must group 3 or more elements (must have 3 or more child nodes)
      case 'toolbar': {
        if (children.length < 3) {
          roleSupportLines.push(el);
          // roleSupportLines.push(lineNumber);
        }
        break;
      }

  // tooltip role cannot contain interactive elements such as buttons, links or inputs
  case 'tooltip': {
    if (el === 'BUTTON' || el === 'A' || el === 'INPUT') {
      roleSupportLines.push(el);
      // roleSupportLines.push(lineNumber);
    }
    break;
  }
  
  // feed role must contain scrollable list of articles

  // math role must either be an img or must use aria-label to provide a string that represents the expression

  // presentation role (ignores semantic html and on nested children except for input and links) ??

  // note role has content which is parenthetic or ancillary to the main content

  // WIDGET ROLES
  // scrollbar role has two required attributes: aria-controls and aria-valuenow

  // searchbar role is type input and with either type='search' or an associated label

  // slider role defines an input where the user selects a value from within a given range

  // spinbutton role ???

  // switch role has the aria-checked attribute as required

  // tab role are elements that must either be a child of an element with the tablist role, or have their id as part of the aria-owns property of a tablist

  // tabpanel role indicates the element is a container for the resources associated with a tab role, where each tab is contained in a tablist.

  // treeitem role must have a parent node with the role=tree

  // COMPOSITE WIDGET
  // combobox role is required to have aria-expanded attribute

  // menu role must have a list of children nodes

  // menubar role is a menu that is visually persistant, required to have list of children nodes

  // tablist role is the parent element for nodes containing role of tab or tabpanel

  // tree role must have children nodes with the role=treeitem

  // treegrid role is a grid or table (combo of tree and grid); required to have child nodes and that if there is a parent row, that the attr aria-expanded exists; must have the attr aria-label or aria-labelledby (only ONE, not BOTH)

  // LANDMARK ROLES: use SPARINGLY (one per doc is best practice)
  // banner role should not be on a header element and should only be one element with this role

  // complementary role must only have one on page, must not be the aside html element

  // contentinfo role must only have one on page, must not be a footer element

  // form role must not be a form element

  // main role must only have one on page, must not be a main element

  // navigation role must only have one on page, must not be a nav element

  // region role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)

  // search role ??? 

  // LIVE REGION ROLES
  // alert role should only be used for text content (not links or buttons), should be used sparingly

  // log role (used where content may change i.e. chatbox, feed, message history, etc) ???

  // marquee role (non-essential info that changes freq.) requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)

  // status role (not important enough to be an alert) - no tests to cover?

  // timer role - unsure how to test for this?? specific to each use cases

  // WINDOW ROLES
  // alertdialog role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH) AND attr aria-describedby AND must be a modal

  // dialog role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)

  // ABSTRACT ROLES: for browsers and dom org ONLY, not assigned by author

  // avoid using the following roles: application, article, cell, columnheader, definition, directory, document, figure, group, heading, img, list, listitem, meter, row, rowgroup, rowheader, seperator, table, term, button, checkbox, gridcell, link, menuitem, menuitemcheckbox, menuitemradio, option, progressbar, radio, textbox, grid, listbox, radiogroup, command, composite, input, landmark, range, roletype, section, sectionhead, select, structure, widget, and window.

    }
  });

  console.log('roleSupportLines:', roleSupportLines);

}

checkAriaRoles();