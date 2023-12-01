const e = require('express');
const vscode = require('vscode');
const { JSDOM } = require('jsdom');

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sample Title</title>
  </head>
  <body>
  <div role="status"></div>
  <div role="main" id="main-container">
    <header>This is the header!</header>
    <div role=""></div>
    <div role="navigation" aria-label="Main">
      <p>Home</p>
      <p>Contact</p>
    </div>
    <h2 role="alert"></h2>
    <div role="log"></div>
    <label for="search-box">
    <div role="searchbox" aria-label="search">
    <div class="link container" role="menubar">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <img role="math" src="someurl.jpg">
    <p role="math" aria-label="math-text">
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
    <img role="banner">
    <p id="day">Enter the day of the month</p>
    <button type="button" tabindex="-1" aria-label="previous day">˱</button>
    <div
      role="spinbutton"
      tabindex="0"
      aria-valuenow="1"
      aria-valuetext="first"
      aria-valuemin="1"
      aria-valuemax="31"
      aria-labelledby="day">
      1
    </div>
    <form id="search" role="search">
      <label for="search-input">Search this site</label>
      <input type="search" id="search-input" name="search" spellcheck="false">
      <input value="Submit" type="submit">
    </form>
    <button type="button" tabindex="-1" aria-label="next day">˲</button>
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

// const { window } = new JSDOM(htmlCode);
// const document = window.document;
// const ludwig = document.body;

// // default message with specific aria-fail found and link to docs
// const defaultMsg = {};

// check to see if an element’s role supports its ARIA attributes
function checkAriaRoles() {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // compile all html elements into node list
    const allElement = ludwig.querySelectorAll('*');

    // array to hold output of the line numbers of failed html tests  
    const roleSupportLines = [];

    // extract roles from every element
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
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/toolbar_role']);
      }
      break;
    }

  // tooltip role cannot contain interactive elements such as buttons, links or inputs
    case 'tooltip': {
      if (el.nodeName === 'BUTTON' || el.nodeName === 'A' || el.nodeName === 'INPUT') {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role']);
      }
      break;
    }
  
  // feed role must contain scrollable list of articles
    case 'feed': {
      if (!children.namedItem('article')) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role']);
      }
      break;
    }

  // math role must either be an img or must use aria-label to provide a string that represents the expression
    case 'math': {
      const label = el.getAttribute('aria-label');
      if (el.nodeName !== 'IMG' && !label) {
          roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/math_role']);
      }
      break;
    }

  // presentation role should not have accessible name as it and its children are 'hidden'; should not have attributes: aria-labelledby or aria-label
    case 'presentation': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if (label || labelledby) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/presentation_role']);
      }
      break;
    }

  // note role has content which is parenthetic or ancillary to the main content
  case 'note': {
      if(el.nodeName !== 'DIV' && el.nodeName !== '') {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/note_role']);
      }
    break;
  }

  // log case should be associated with divs or list items 
  case 'log': {
      if(el.nodeName !== 'UL' && el.nodeName !== 'OL' && el.nodeName !== 'DIV') {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/log_role']);
    }
  }

  // WIDGET ROLES
  // scrollbar role has two required attributes: aria-controls and aria-valuenow
    case 'scrollbar': {
      const controls = el.getAttribute('aria-controls');
      const valueNow = el.getAttribute('aria-valuenow');
      if (!controls || !valueNow) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/scrollbar_role']);
      }
      break;
    }

  // searchbox role is type input and with either type='search' or an associated label
    case 'searchbox': {
      const type = el.getAttribute('type');
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      const id = el.getAttribute('id');
      // search for label 'for' - match to id from searchbox
      const labelForArr = [];
      elementRoles.forEach((el) => {
        if (el[0].nodeName === 'LABEL') {
          labelForArr.push(el[0].getAttribute('for'));
        }
      });
      // check attr: id for match in labels arr
      let forIDMatch = false;
      labelForArr.forEach(el => {
        if (el === id) {
          forIDMatch = true;
        }
      });
      // else if for the input type and see if second test is an OR
      if (el.nodeName === 'INPUT') {
        if (!forIDMatch && type !== 'search') {
          roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/searchbox_role']);
        }
      } else {
        if (!label && !labelledby) {
          roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/searchbox_role']);
        }
      }
      break;
    }

  // slider role defines an input where the user selects a value from within a given range
    case 'slider': {
      const valueNow = el.getAttribute('aria-valuenow');
      if (!valueNow) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role']);
      }
      break;
    }

  // spinbutton role requires a label - if input element is used then associated label, if not, aria-labelledby or aria-label; if not input element, then tabindex attribute must be present
    case 'spinbutton': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      const tabIndex = el.getAttribute('tabindex');
      if ((el !== 'INPUT' && !tabIndex) || (!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/spinbutton_role']);
      }
      break;
    }


    // switch role has the aria-checked attribute as required
      case 'switch': {
        const checked = el.getAttribute('aria-checked');
        // console.log('SWITCH:', checked);
        if (!checked || (checked !== 'true' && checked !== 'false')) { //<--NEED TO FIX STILL!
          roleSupportLines.push(el.nodeName);
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
      if (parentRole !== 'tablist' && !ariaOwns) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role']);
      }
      break;
    }

  // tabpanel role indicates the element is a container for the resources associated with a tab role, where each tab is contained in a tablist.
    case 'tabpanel': {
      const labelledby = el.getAttribute('aria-labelledby');
      // iterate through elementRoles, looking for any elements with role='tablist' that has an aria-owns attr
      const tabsIdArr = [];
      elementRoles.forEach((el) => {
        if (el[3] === 'tab') {
          tabsIdArr.push(el[0].getAttribute('id'));
        }
      });
      if (!tabsIdArr.includes(labelledby)) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tabpanel_role']);
      }
      break;
    }

  // treeitem role must have a parent node with the role=tree
    case 'treeitem': {
      const parentRole = parent.getAttribute('role');
      if (parentRole !== 'tree') {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treeitem_role']);
      }
      break;
    }

  // COMPOSITE WIDGET
  // combobox role is required to have aria-expanded attribute
    case 'combobox': {
      const expanded = el.getAttribute('aria-expanded');
      if (!expanded) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role']);
      }
      break;
    }

  // menu role must have a list of children nodes
    case 'menu': {
      if (children.length === 0) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role']);
      }
      break;
    }

  // menubar role is a menu that is visually persistant, required to have list of children nodes
    case 'menubar': {
      if (children.length === 0) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menubar_role']);
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
    if (children.length === 0 || nonTabs) {
      roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role']);
    }
    break;
  }

  // tree role must have children nodes with the role=treeitem
    case 'tree': {
      const childRole = children[0].getAttribute('role'); //<--add more checks to iterate through html child nodes for roles
      if (children.length === 0 || childRole !== 'treeitem') {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tree_role']);
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
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treegrid_role']);
      }
      break;
    }

  // LANDMARK ROLES: use SPARINGLY (one per doc is best practice)
  // banner role should not be on a header element and should only be one element with this role
    case 'banner': {
      let count = 0;
      elementRoles.forEach((el) => {
        if (el[3] === 'banner') {
          count++;
        }
      });
      if (el.nodeName === 'HEADER' || count > 1) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/banner_role']);
      }
      break;
    }

  // complementary role must only have one on page, must not be the aside html element
    case 'complementary': {
      let count = 0;
      elementRoles.forEach((el) => {
        if (el[3] === 'complementary') {
          count++;
        }
      });
      if (el.nodeName === 'ASIDE' || count > 1) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/complementary_role']);
      }
      break;
    }

  // contentinfo role must only have one on page, must not be a footer element
    case 'contentinfo': {
      let count = 0;
      elementRoles.forEach((el) => {
        if (el[3] === 'contentinfo') {
          count++;
        }
      });
      if (el.nodeName === 'FOOTER' || count > 1) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/contentinfo_role']);
      }
      break;
    }

  // form role must not be a form element
    case 'form': {
      if (el.nodeName === 'FORM') {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/form_role']);
      }
      break;
    }

  // main role must only have one on page, must not be a main element
    case 'main': {
      let count = 0;
      elementRoles.forEach((el) => {
        if (el[3] === 'main') {
          count++;
        }
      });
      if (el.nodeName === 'MAIN' || count > 1) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/main_role']);
      }
      break;
    }

  // navigation role must only have one on page, must not be a nav element
    case 'navigation': {
      let count = 0;
      elementRoles.forEach((el) => {
        if (el[3] === 'navigation') {
          count++;
        }
      });
      if (el.nodeName === 'NAV' || count > 1) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role']);
      }
      break;
    }

  // region role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
    case 'region': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/region_role']);
      }
      break;
    }

  // search role has best practice of using a form element or designated top parent element containing all search elements
    case 'search': {
      const childAttr = [];
      Array.from(children).forEach(el => {
        const id = el.getAttribute('id');
        const type = el.getAttribute('type');
        const label = el.getAttribute('label');
        const name = el.getAttribute('name');
        childAttr.push(id, type, label, name);
      });
      // console.log('SEARCH', childAttr);
      if (el.nodeName !== 'FORM' || !childAttr.includes('search')) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role']);
      }
      break;
    }


  // LIVE REGION ROLES
  // alert role should only be used for text content (not links or buttons), should be used sparingly
  case 'alert': {
    if (el.nodeName === 'BUTTON' || el.nodeName === 'A' || (el.nodeName === 'INPUT' && type === 'button')) {
      roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role']);
    }
    break;
  }

    // log role (used where content may change i.e. chatbox, feed, message history, etc) ???

  // marquee role (non-essential info that changes freq.) requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
    case 'marquee': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/marquee_role']);
      }
      break;
    }

  // status role (not important enough to be an alert) - no tests to cover?
  case 'status': {
      if (el.nodeName !== "DIV" && el.nodeName !== "SPAN" && el.nodeName !== "SECTION" && el.nodeName !== "P") {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role']);
      }
  }

  // timer role - unsure how to test for this?? specific to each use cases
  // 
  case 'timer': {
      if (el.nodeName !== 'TIMER' && el.nodeName !== 'DIV') {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/timer_role']);
      }
    break;
  }

  // WINDOW ROLES
  // alertdialog role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH) AND attr aria-describedby AND must be a modal
    case 'alertdialog': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      const describedby = el.getAttribute('aria-describedby');
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alertdialog_role']);
      }
      break;
    }

  // dialog role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
    case 'dialog': {
      const label = el.getAttribute('aria-label');
      const labelledby = el.getAttribute('aria-labelledby');
      if ((!label && !labelledby) || (label && labelledby)) {
        roleSupportLines.push([el, 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role']);
      }
      break;
    }

    // ABSTRACT ROLES: for browsers and dom org ONLY, not assigned by author

    // avoid using the following roles: application, article, cell, columnheader, definition, directory, document, figure, group, heading, img, list, listitem, meter, row, rowgroup, rowheader, seperator, table, term, button, checkbox, gridcell, link, menuitem, menuitemcheckbox, menuitemradio, option, progressbar, radio, textbox, grid, listbox, radiogroup, command, composite, input, landmark, range, roletype, section, sectionhead, select, structure, widget, and window.
      case 'application': {
        roleSupportLines.push(el);
        break;
      }
      case 'article': {
        roleSupportLines.push(el);
        break;
      }
      case 'cell': {
        roleSupportLines.push(el);
        break;
      }
      case 'columnheader': {
        roleSupportLines.push(el);
        break;
      }
      case 'definition': {
        roleSupportLines.push(el);
        break;
      }
      case 'directory': {
        roleSupportLines.push(el);
        break;
      }
      case 'document': {
        roleSupportLines.push(el);
        break;
      }
      case 'figure': {
        roleSupportLines.push(el);
        break;
      }
      case 'group': {
        roleSupportLines.push(el);
        break;
      }
      case 'heading': {
        roleSupportLines.push(el);
        break;
      }
      case 'img': {
        roleSupportLines.push(el);
        break;
      }
      case 'list': {
        roleSupportLines.push(el);
        break;
      }
      case 'listitem': {
        roleSupportLines.push(el);
        break;
      }
      case 'meter': {
        roleSupportLines.push(el);
        break;
      }
      case 'row': {
        roleSupportLines.push(el);
        break;
      }
      case 'rowgroup': {
        roleSupportLines.push(el);
        break;
      }
      case 'rowheader': {
        roleSupportLines.push(el);
        break;
      }
      case 'seperator': {
        roleSupportLines.push(el);
        break;
      }
      case 'table': {
        roleSupportLines.push(el);
        break;
      }
      case 'term': {
        roleSupportLines.push(el);
        break;
      }
      case 'button': {
        roleSupportLines.push(el);
        break;
      }
      case 'checkbox': {
        roleSupportLines.push(el);
        break;
      }
      case 'gridcell': {
        roleSupportLines.push(el);
        break;
      }
      case 'link': {
        roleSupportLines.push(el);
        break;
      }
      case 'menuitem': {
        roleSupportLines.push(el);
        break;
      }
      case 'menuitemcheckbox': {
        roleSupportLines.push(el);
        break;
      }
      case 'menuitemradio': {
        roleSupportLines.push(el);
        break;
      }
      case 'option': {
        roleSupportLines.push(el);
        break;
      }
      case 'progressbar': {
        roleSupportLines.push(el);
        break;
      }
      case 'radio': {
        roleSupportLines.push(el);
        break;
      }
      case 'textbox': {
        roleSupportLines.push(el);
        break;
      }
      case 'grid': {
        roleSupportLines.push(el);
        break;
      }
      case 'listbox': {
        roleSupportLines.push(el);
        break;
      }
      case 'radiogroup': {
        roleSupportLines.push(el);
        break;
      }
      case 'command': {
        roleSupportLines.push(el);
        break;
      }
      case 'composite': {
        roleSupportLines.push(el);
        break;
      }
      case 'input': {
        roleSupportLines.push(el);
        break;
      }
      case 'landmark': {
        roleSupportLines.push(el);
        break;
      }
      case 'range': {
        roleSupportLines.push(el);
        break;
      }
      case 'roletype': {
        roleSupportLines.push(el);
        break;
      }
      case 'section': {
        roleSupportLines.push(el);
        break;
      }
      case 'sectionhead': {
        roleSupportLines.push(el);
        break;
      }
      case 'select': {
        roleSupportLines.push(el);
        break;
      }
      case 'structure': {
        roleSupportLines.push(el);
        break;
      }
      case 'widget': {
        roleSupportLines.push(el);
        break;
      }
      case 'window': {
        roleSupportLines.push(el);
        break;
      }
    
      }
    });

  console.log('roleSupportLines:', roleSupportLines);
  // returns a nested arr of arrays:
  // arr[0] --> element on node list
  // arr[1] --> link to specific role documentation on mdn
  return roleSupportLines;
  }
}

module.exports = {
  checkAriaRoles
};