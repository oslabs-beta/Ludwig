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
  <div role="main" id="main-container">
    <header>This is the header!</header>
    <div role="complementary"></div>
    <div role="navigation" aria-label="Main">
      <p>Home</p>
      <p>Contact</p>
    </div>
    <input role="searchbox" label="search">
    <div class="link container" role="menubar">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <p role="math">a + b = c</p>
    <div role="region" aria-label="Example"></div>
    <article role="marquee" aria-labelledby="example"></article>
    <meter id="fuel" role="slider" min="0" max="100" value="50" aria-valuenow="50">at 50/100</meter>
    <div role="toolbar">
      <p>A tip!</p>
      <p>Another tip.</p>
      <p>More tips!!</p>
    </div>
    <div role="form">
    </div>
    <ul role="tree" aria-labelledby="treeLabel">
      <li role="treeitem" aria-expanded="true">
      <li role="treeitem" aria-expanded="true">
      <li role="treeitem" aria-expanded="true">
    </ul>
    <button role="switch" aria-checked="false"></button>
    <div id="duplicate">Something</div>
    <input id="duplicate" type="button">
    <div>GorbleGorble</div>
    <button name='button' role='button'>clickclickclick</button>
    <ol role="menubar">
      <li>Are</li>
      <li>A</li>
      <li>Menu</li>
    </ol>
    <img src="someurl.jpg" role="presentation" aria-label="img of lake"/>
    <div class="tabs">
  <div role="tablist" aria-label="Sample Tabs">
    <button
      role="tab"
      aria-selected="true"
      aria-controls="panel-1"
      id="tab-1"
      tabindex="0">
      First Tab
    </button>
    <button
      role="tab"
      aria-selected="false"
      aria-controls="panel-2"
      id="tab-2"
      tabindex="-1">
      Second Tab
    </button>
    <button
      role="tab"
      aria-selected="false"
      aria-controls="panel-3"
      id="tab-3"
      tabindex="-1">
      Third Tab
    </button>
  </div>
  <div id="panel-1" role="tabpanel" tabindex="0" aria-labelledby="tab-1">
    <p>Content for the first panel</p>
  </div>
  <div id="panel-2" role="tabpanel" tabindex="0" aria-labelledby="tab-2" hidden>
    <p>Content for the second panel</p>
  </div>
  <div id="panel-3" role="tabpanel" tabindex="0" aria-labelledby="tab-3" hidden>
    <p>Content for the third panel</p>
  </div>
</div>
    <div role="feed">
      <p>An article full of really cool info.</p>
    </div>
    </div>
  </body>
  <div role="contentinfo">
  </div>
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
    const item = [el, el.parentElement, el.children];
    const role = el.getAttribute('role');
    item.push(role);
    elementRoles.push(item);
  });
  // console.log(elementRoles);
  
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
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // tooltip role cannot contain interactive elements such as buttons, links or inputs
    case 'tooltip': {
      if (el.nodeName === 'BUTTON' || el.nodeName === 'A' || el.nodeName === 'INPUT') {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }
  
  // feed role must contain scrollable list of articles
    case 'feed': {
      if (!children.namedItem('article')) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // math role must either be an img or must use aria-label to provide a string that represents the expression
    case 'math': {
      const label = el.getAttribute('aria-label');
      if (el.nameNode !== 'IMG' || !label || label === '') {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // presentation role should not have accccessible name as it and its children are 'hidden'; should not have attributes: aria-labelledby or aria-label
    case 'presentation': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if (label || labelledby) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // note role has content which is parenthetic or ancillary to the main content
  // case 'note': {
  //   if () {
  //     roleSupportLines.push(el.nodeName);
  //     // roleSupportLines.push(lineNumber);
  //   }
  //   break;
  // }

  // WIDGET ROLES
  // scrollbar role has two required attributes: aria-controls and aria-valuenow
    case 'scrollbar': {
      const controls = el.getAttribute('aria-controls');
      const valueNow = el.getAttribute('aria-valuenow');
      if (!controls || !valueNow) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // searchbox role is type input and with either type='search' or an associated label
    case 'searchbox': {
      const label = el.getAttribute('aria-label');
      const type = el.getAttribute('type');
      // console.log('SEARCHBOX:', label);
      if (el.nodeName !== 'INPUT' || type !== 'search' || (!type && !label)) { //<--NEED TO FIX STILL!
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // slider role defines an input where the user selects a value from within a given range
    case 'slider': {
      const valueNow = el.getAttribute('aria-valuenow');
      if (!valueNow) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // spinbutton role ???

  // switch role has the aria-checked attribute as required
    case 'switch': {
      const checked = el.getAttribute('aria-checked');
      // console.log('SWITCH:', checked);
      if (!checked || (checked !== 'true' && checked !== 'false')) { //<--NEED TO FIX STILL!
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // tab role are elements that must either be a child of an element with the tablist role, or have their id as part of the aria-owns property of a tablist
    case 'tab': {
      const parentRole = parent.getAttribute('role');
      const id = el.getAttribute('id');
      // iterate through elementRoles, looking for any elements with role='tablist' that has an aria-owns attr
      const aoArr = [];
      elementRoles.forEach((el) => {
        if (el[3] === 'tablist') {
          aoArr.push(el[0].getAttribute('aria-owns'));
        }
      });
      let ariaOwns = false;
      aoArr.forEach(el => {
        if (el === id) {
          ariaOwns = true;
        }
      });
      // console.log('TAB:', parentRole);
      // console.log('arr + aria-owns:', aoArr, ariaOwns);
      // console.log('id:', id);
      if (parentRole !== 'tablist' && !ariaOwns) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // tabpanel role indicates the element is a container for the resources associated with a tab role, where each tab is contained in a tablist.
    case 'tabpanel': {
      const labelledby = el.getAttribute('aria-labelledby');
      // console.log('TABPANEL:', labelledby);
      // iterate through elementRoles, looking for any elements with role='tablist' that has an aria-owns attr
      const tabsIdArr = [];
      elementRoles.forEach((el) => {
        if (el[3] === 'tab') {
          tabsIdArr.push(el[0].getAttribute('id'));
        }
      });
      // console.log('Tabs Id Arr:', tabsIdArr);
      if (!tabsIdArr.includes(labelledby)) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // treeitem role must have a parent node with the role=tree
    case 'treeitem': {
      const parentRole = parent.getAttribute('role');
      if (parentRole !== 'tree') {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // COMPOSITE WIDGET
  // combobox role is required to have aria-expanded attribute
    case 'combobox': {
      const expanded = el.getAttribute('aria-expanded');
      if (!expanded) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // menu role must have a list of children nodes
    case 'menu': {
      if (children.length === 0) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // menubar role is a menu that is visually persistant, required to have list of children nodes
    case 'menubar': {
      if (children.length === 0) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // tablist role is the parent element for nodes containing role of tab or tabpanel
  case 'tablist': {
    const childRoles = Array.from(children, el => el.getAttribute('role'));
    let nonTabs = false;
    childRoles.forEach(el => {
      if (el !== 'tab' && el !== 'tabpanel') {
        nonTabs = true;
      }
    });
    // console.log('childRoles:', childRoles);
    if (children.length === 0 || nonTabs) {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
    }
    break;
  }

  // tree role must have children nodes with the role=treeitem
    case 'tree': {
      const childRole = children[0].getAttribute('role'); //<--add more checks to iterate through html child nodes for roles
      // console.log('TREE:', childRole)
      if (children.length === 0 || childRole !== 'tree') {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // treegrid role is a grid or table (combo of tree and grid); required to have child nodes and that if there is a parent row, that the attr aria-expanded exists; must have the attr aria-label or aria-labelledby (only ONE, not BOTH)
    case 'treegrid': {
      const parentRow = Array.from(parent);
      console.log('parentRow', parentRow);
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if (children.length === 0) { //<--NEED TO ADD MORE TEST CONDITIONALS
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // LANDMARK ROLES: use SPARINGLY (one per doc is best practice)
  // banner role should not be on a header element and should only be one element with this role
    case 'banner': {
      if (el.nodeName === 'HEADER') { //<-- how to check for more than one?
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // complementary role must only have one on page, must not be the aside html element
    case 'complementary': {
      if (el.nodeName === 'ASIDE') { //<-- how to check for more than one?
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // contentinfo role must only have one on page, must not be a footer element
    case 'contentinfo': {
      if (el.nodeName === 'FOOTER') { //<-- how to check for more than one?
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // form role must not be a form element
    case 'form': {
      if (el.nodeName === 'FORM') {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // main role must only have one on page, must not be a main element
    case 'main': {
      if (el.nodeName === 'MAIN') { //<-- how to check for more than one?
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // navigation role must only have one on page, must not be a nav element
    case 'navigation': {
      if (el.nodeName === 'NAV') { //<-- how to check for more than one?
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // region role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
    case 'region': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // search role ??? 

  // LIVE REGION ROLES
  // alert role should only be used for text content (not links or buttons), should be used sparingly

  // log role (used where content may change i.e. chatbox, feed, message history, etc) ???

  // marquee role (non-essential info that changes freq.) requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
    case 'marquee': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // status role (not important enough to be an alert) - no tests to cover?

  // timer role - unsure how to test for this?? specific to each use cases

  // WINDOW ROLES
  // alertdialog role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH) AND attr aria-describedby AND must be a modal
    case 'alertdialog': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      const describedby = el.getAttribute('aria-describedby');
      console.log('DIALOG:', label, labelledby);
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // dialog role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
    case 'dialog': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push(el.nodeName);
        // roleSupportLines.push(lineNumber);
      }
      break;
    }

  // ABSTRACT ROLES: for browsers and dom org ONLY, not assigned by author

  // avoid using the following roles: application, article, cell, columnheader, definition, directory, document, figure, group, heading, img, list, listitem, meter, row, rowgroup, rowheader, seperator, table, term, button, checkbox, gridcell, link, menuitem, menuitemcheckbox, menuitemradio, option, progressbar, radio, textbox, grid, listbox, radiogroup, command, composite, input, landmark, range, roletype, section, sectionhead, select, structure, widget, and window.
    case 'application': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'article': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'cell': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'columnheader': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'definition': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'directory': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'document': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'figure': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'group': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'heading': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'img': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'list': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'listitem': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'meter': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'row': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'rowgroup': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'rowheader': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'seperator': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'table': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'term': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'button': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'checkbox': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'gridcell': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'link': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'menuitem': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'menuitemcheckbox': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'menuitemradio': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'option': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'progressbar': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'radio': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'textbox': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'grid': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'listbox': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'radiogroup': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'command': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'composite': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'input': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'landmark': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'range': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'roletype': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'section': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'sectionhead': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'select': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'structure': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'widget': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
    case 'window': {
      roleSupportLines.push(el.nodeName);
      // roleSupportLines.push(lineNumber);
      break;
    }
  
    }
  });

  console.log('roleSupportLines:', roleSupportLines);

}

// BEFORE PUSHING A LAST COMMIT --> CHANGE ALL PUSH el.nodeName to jsut el
checkAriaRoles();