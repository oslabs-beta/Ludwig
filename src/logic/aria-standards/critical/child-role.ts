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
export function checkChildRoles() {
  // compile all html elements into node list
  const allElement = ludwig.querySelectorAll('*');

  // array to hold output of the html elements that fail
  const incorrectChildRoles: any[] = [];

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
      // toolbar role must group 3 or more elements (must have 3 or more child nodes)
      case 'toolbar': {
        if (children.length < 3) {
          // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
          incorrectChildRoles.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/toolbar_role',
          ]);
        }
        break;
      }

      // feed role must contain scrollable list of articles
      case 'feed': {
        for (const child of children) {
          console.log(child.tagName);
          if (child.tageName !== 'ARTICLE') {
            // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
            incorrectChildRoles.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role',
            ]);
          }
        }
        break;
      }

      // menu role must have a list of children nodes
      case 'menu': {
        if (children.length === 0) {
          // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
          incorrectChildRoles.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role',
          ]);
        }
        break;
      }

      // menubar role is a menu that is visually persistant, required to have list of children nodes
      case 'menubar': {
        if (children.length === 0) {
          // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
          incorrectChildRoles.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menubar_role',
          ]);
        }
        break;
      }

      // tablist role is the parent element for nodes containing role of tab or tabpanel
      case 'tablist': {
        const childRoles = Array.from(children, (el: any) => el.getAttribute('role'));
        let nonTabs = false;
        childRoles.forEach((el) => {
          if (el !== 'tab' && el !== 'tabpanel') {
            nonTabs = true;
          }
        });
        if (children.length === 0 || nonTabs) {
          // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
          incorrectChildRoles.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role',
          ]);
        }
        break;
      }

      // tree role must have children nodes with the role=treeitem
      case 'tree': {
        const childRole = children[0].getAttribute('role'); //<--add more checks to iterate through html child nodes for roles
        if (children.length === 0 || childRole !== 'treeitem') {
          // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
          incorrectChildRoles.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tree_role',
          ]);
        }
        break;
      }

      // search role has best practice of using a form element or designated top parent element containing all search elements
      case 'search': {
        const childAttr: any[] = [];
        Array.from(children).forEach((el: any) => {
          const id = el.getAttribute('id');
          const type = el.getAttribute('type');
          const label = el.getAttribute('label');
          const name = el.getAttribute('name');
          childAttr.push(id, type, label, name);
        });
        if (!childAttr.includes('search')) {
          // const lineNumber = activeEditor.document.positionAt(el.startOffset).line;
          incorrectChildRoles.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role',
          ]);
        }
        break;
      }
    }
  });

  // returns a nested arr of arrays:
  // arr[0] --> element on node list
  // arr[1] --> link to specific role documentation on mdn
  return incorrectChildRoles;
}

const test = checkChildRoles();
console.log(test);
