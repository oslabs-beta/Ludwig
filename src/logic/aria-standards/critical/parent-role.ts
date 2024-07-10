const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

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
    <div role=""></div>
    <div role="navigation" aria-label="Main">
      <p>Home</p>
      <p>Contact</p>
    </div>
    <div class="link container" role="menubar">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <div role="toolbar">
      <p>Another tip.</p>
      <p>More tips!!</p>
      <p>more tips...</p>
    </div>
    <div role="form">
    </div>
    <ul role="tree" aria-labelledby="treeLabel">
      <li role="treeitem" aria-expanded="true">
      <li role="treeitem" aria-expanded="true">
      <li role="treeitem" aria-expanded="true">
    </ul>
    <form id="search" role="search">
      <label for="search-input">Search this site</label>
      <input type="search" id="search-input" name="search" spellcheck="false">
      <input value="Submit" type="submit">
    </form>
    <div role="menu">
      <p>This is a menu item</p>
    </div>
    <ol role="menubar">
      <li></li>
      <li></li>
    </ol>
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
      <article>An article full of really cool info.</article>
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

// check to see if an element’s role supports its ARIA attributes
function checkParentRole() {
  // compile all html elements into node list
  const allElement = ludwig.querySelectorAll('*');

  // array to hold output of the html elements that fail
  const incorrectParentRoles: any[] = [];

  // extract roles from every element
  const elementRoles: any[] = [];
  allElement.forEach((el: any) => {
    const item = [el, el.parentElement, el.children];
    const role = el.getAttribute('role');
    item.push(role);
    elementRoles.push(item);
  });
  // console.log(elementRoles);

  elementRoles.forEach((arr) => {
    const el = arr[0];
    const parent = arr[1];
    const children = arr[2];
    const role = arr[3];

    switch (role) {
      // tab role are elements that must either be a child of an element with the tablist role, or have their id as part of the aria-owns property of a tablist
      case 'tab': {
        const parentRole = parent.getAttribute('role');
        const id = el.getAttribute('id');
        // iterate through elementRoles, looking for any elements with role='tablist' that has an aria-owns attr
        const aoArr: any[] = [];
        elementRoles.forEach((el) => {
          if (el[3] === 'tablist') {
            aoArr.push(el[0].getAttribute('aria-owns'));
          }
        });
        let ariaOwns = false;
        aoArr.forEach((el) => {
          // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
          if (el === id) {
            ariaOwns = true;
          }
        });
        if (parentRole !== 'tablist' && !ariaOwns) {
          incorrectParentRoles.push(
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role'
          );
        }
        break;
      }

      // treeitem role must have a parent node with the role=tree
      case 'treeitem': {
        const parentRole = parent.getAttribute('role');
        if (parentRole !== 'tree') {
          incorrectParentRoles.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treeitem_role',
          ]);
        }
        break;
      }
    }
  });

  // returns a nested arr of arrays:
  // arr[0] --> element on node list
  // arr[1] --> link to specific role documentation on mdn
  return incorrectParentRoles;
}

const test = checkParentRole();
console.log(test);
