const vscode = require('vscode');
const { JSDOM } = require('jsdom');
const { getLineNumber } = require('../../getLineNumber');

// check to see if an element’s role supports its ARIA attributes
export function checkAriaRoles(): any {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.languageId === 'html') {
    const htmlCode = activeEditor.document.getText();
    const { window } = new JSDOM(htmlCode);
    const document = window.document;
    const ludwig = document.body;

    // compile all html elements into node list
    const allElement = ludwig.querySelectorAll('*');

    // array to hold output of the line numbers of failed html tests
    const incorrectRoleSupport: any[] = [];
    const set = new Set();

    // extract roles from every element
    const elementRoles: any[] = [];
    allElement.forEach((el: any) => {
      const item = [el, el.parentElement, el.children];
      const role = el.getAttribute('role');
      item.push(role);
      elementRoles.push(item);
    });

    // iterate through elementRoles, checking role against type according to guidelines on: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
    elementRoles.forEach((arr: any) => {
      const el = arr[0];
      const parent = arr[1];
      const children = arr[2];
      const role = arr[3];

      const lineNumber = getLineNumber(activeEditor.document, el.outerHTML, set);
      set.add(lineNumber);

      switch (role) {
        // DOM STRUCTURE
        // toolbar role must group 3 or more elements (must have 3 or more child nodes)
        case 'toolbar': {
          if (children.length < 3) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/toolbar_role',
              lineNumber,
            ]);
          }
          break;
        }

        // tooltip role cannot contain interactive elements such as buttons, links or inputs
        case 'tooltip': {
          if (el.nodeName === 'BUTTON' || el.nodeName === 'A' || el.nodeName === 'INPUT') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role',
              lineNumber,
            ]);
          }
          break;
        }

        // feed role must contain scrollable list of articles
        case 'feed': {
          if (!children.namedItem('article')) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role',
              lineNumber,
            ]);
          }
          break;
        }

        // math role must either be an img or must use aria-label to provide a string that represents the expression
        case 'math': {
          const label = el.getAttribute('aria-label');
          if (el.nodeName !== 'IMG' && !label) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/math_role',
              lineNumber,
            ]);
          }
          break;
        }

        // presentation role should not have accessible name as it and its children are 'hidden'; should not have attributes: aria-labelledby or aria-label
        case 'presentation': {
          const label = el.getAttribute('aria-label');
          const labelledby = el.getAttribute('aria-labelledby');
          if (label || labelledby) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/presentation_role',
              lineNumber,
            ]);
          }
          break;
        }

        // note role has content which is parenthetic or ancillary to the main content
        case 'note': {
          if (el.nodeName !== 'DIV' && el.nodeName !== '') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/note_role',
              lineNumber,
            ]);
          }
          break;
        }

        // log case should be associated with divs or list items
        case 'log': {
          if (el.nodeName !== 'UL' && el.nodeName !== 'OL' && el.nodeName !== 'DIV') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/log_role',
              lineNumber,
            ]);
          }
        }

        // WIDGET ROLES
        // scrollbar role has two required attributes: aria-controls and aria-valuenow
        case 'scrollbar': {
          const controls = el.getAttribute('aria-controls');
          const valueNow = el.getAttribute('aria-valuenow');
          if (!controls || !valueNow) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/scrollbar_role',
              lineNumber,
            ]);
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
          const labelForArr: any[] = [];
          elementRoles.forEach((el) => {
            if (el[0].nodeName === 'LABEL') {
              labelForArr.push(el[0].getAttribute('for'));
            }
          });
          // check attr: id for match in labels arr
          let forIDMatch = false;
          labelForArr.forEach((el) => {
            if (el === id) {
              forIDMatch = true;
            }
          });
          // else if for the input type and see if second test is an OR
          if (el.nodeName === 'INPUT') {
            if (!forIDMatch && type !== 'search') {
              incorrectRoleSupport.push([
                el,
                'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/searchbox_role',
                lineNumber,
              ]);
            }
          } else {
            if (!label && !labelledby) {
              incorrectRoleSupport.push([
                el,
                'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/searchbox_role',
                lineNumber,
              ]);
            }
          }
          break;
        }

        // slider role defines an input where the user selects a value from within a given range
        case 'slider': {
          const valueNow = el.getAttribute('aria-valuenow');
          if (!valueNow) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role',
              lineNumber,
            ]);
          }
          break;
        }

        // spinbutton role requires a label - if input element is used then associated label, if not, aria-labelledby or aria-label; if not input element, then tabindex attribute must be present
        case 'spinbutton': {
          const label = el.getAttribute('aria-label');
          const labelledby = el.getAttribute('aria-labelledby');
          const tabIndex = el.getAttribute('tabindex');
          if ((el !== 'INPUT' && !tabIndex) || (!label && !labelledby) || (label && labelledby)) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/spinbutton_role',
              lineNumber,
            ]);
          }
          break;
        }

        // switch role has the aria-checked attribute as required
        case 'switch': {
          const checked = el.getAttribute('aria-checked');
          // console.log('SWITCH:', checked);
          if (!checked || (checked !== 'true' && checked !== 'false')) {
            //<--NEED TO FIX STILL!
            incorrectRoleSupport.push(el.nodeName);
          }
          break;
        }

        // tab role are elements that must either be a child of an element with the tablist role, or have their id as part of the aria-owns property of a tablist
        case 'tab': {
          const parentRole: any = parent.getAttribute('role');
          const id: any = el.getAttribute('id');
          // iterate through elementRoles, looking for any elements with role='tablist' that has an aria-owns attr
          const aoArr: any[] = [];
          elementRoles.forEach((el: any) => {
            if (el[3] === 'tablist') {
              aoArr.push(el[0].getAttribute('aria-owns'));
            }
          });
          let ariaOwns = false;
          aoArr.forEach((el: any) => {
            if (el === id) {
              ariaOwns = true;
            }
          });
          if (parentRole !== 'tablist' && !ariaOwns) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role',
              lineNumber,
            ]);
          }
          break;
        }

        // tabpanel role indicates the element is a container for the resources associated with a tab role, where each tab is contained in a tablist.
        case 'tabpanel': {
          const labelledby: any = el.getAttribute('aria-labelledby');
          // iterate through elementRoles, looking for any elements with role='tablist' that has an aria-owns attr
          const tabsIdArr: any[] = [];
          elementRoles.forEach((el: any) => {
            if (el[3] === 'tab') {
              tabsIdArr.push(el[0].getAttribute('id'));
            }
          });
          if (!tabsIdArr.includes(labelledby)) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tabpanel_role',
              lineNumber,
            ]);
          }
          break;
        }

        // treeitem role must have a parent node with the role=tree
        case 'treeitem': {
          const parentRole = parent.getAttribute('role');
          if (parentRole !== 'tree') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treeitem_role',
              lineNumber,
            ]);
          }
          break;
        }

        // COMPOSITE WIDGET
        // combobox role is required to have aria-expanded attribute
        case 'combobox': {
          const expanded = el.getAttribute('aria-expanded');
          if (!expanded) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role',
              lineNumber,
            ]);
          }
          break;
        }

        // menu role must have a list of children nodes
        case 'menu': {
          if (children.length === 0) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role',
              lineNumber,
            ]);
          }
          break;
        }

        // menubar role is a menu that is visually persistant, required to have list of children nodes
        case 'menubar': {
          if (children.length === 0) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menubar_role',
              lineNumber,
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
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role',
              lineNumber,
            ]);
          }
          break;
        }

        // tree role must have children nodes with the role=treeitem
        case 'tree': {
          const childRole = children[0].getAttribute('role'); //<--add more checks to iterate through html child nodes for roles
          if (children.length === 0 || childRole !== 'treeitem') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tree_role',
              lineNumber,
            ]);
          }
          break;
        }

        // treegrid role is a grid or table (combo of tree and grid); required to have child nodes and that if there is a parent row, that the attr aria-expanded exists; must have the attr aria-label or aria-labelledby (only ONE, not BOTH)
        case 'treegrid': {
          const parentRow = Array.from(parent);
          console.log('parentRow', parentRow);
          const label = el.getAttribute('aria-label');
          const labelledby = el.getAttribute('aria-labelledby');
          if (children.length === 0) {
            //<--NEED TO ADD MORE TEST CONDITIONALS
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treegrid_role',
              lineNumber,
            ]);
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
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/banner_role',
              lineNumber,
            ]);
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
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/complementary_role',
              lineNumber,
            ]);
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
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/contentinfo_role',
              lineNumber,
            ]);
          }
          break;
        }

        // form role must not be a form element
        case 'form': {
          if (el.nodeName === 'FORM') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/form_role',
              lineNumber,
            ]);
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
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/main_role',
              lineNumber,
            ]);
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
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role',
              lineNumber,
            ]);
          }
          break;
        }

        // region role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
        case 'region': {
          const label: any = el.getAttribute('aria-label');
          const labelledby: any = el.getAttribute('aria-labelledby');
          if ((!label && !labelledby) || (label && labelledby)) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/region_role',
              lineNumber,
            ]);
          }
          break;
        }

        // search role has best practice of using a form element or designated top parent element containing all search elements
        case 'search': {
          const childAttr: any[] = [];
          Array.from(children).forEach((el: any) => {
            const id: any = el.getAttribute('id');
            const type: any = el.getAttribute('type');
            const label: any = el.getAttribute('label');
            const name: any = el.getAttribute('name');
            childAttr.push(id, type, label, name);
          });
          // console.log('SEARCH', childAttr);
          if (el.nodeName !== 'FORM' || !childAttr.includes('search')) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role',
              lineNumber,
            ]);
          }
          break;
        }

        // // LIVE REGION ROLES
        // // alert role should only be used for text content (not links or buttons), should be used sparingly
        // case 'alert': {
        //   if (el.nodeName === 'BUTTON' || el.nodeName === 'A' || (el.nodeName === 'INPUT' && type === 'button')) {
        //     incorrectRoleSupport.push([
        //       el,
        //       'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role',
        //       lineNumber,
        //     ]);
        //   }
        //   break;
        // }

        // log role (used where content may change i.e. chatbox, feed, message history, etc) ???

        // marquee role (non-essential info that changes freq.) requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
        case 'marquee': {
          const label: any = el.getAttribute('aria-label');
          const labelledby: any = el.getAttribute('aria-labelledby');
          if ((!label && !labelledby) || (label && labelledby)) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/marquee_role',
              lineNumber,
            ]);
          }
          break;
        }

        // status role (not important enough to be an alert) - no tests to cover?
        case 'status': {
          if (el.nodeName !== 'DIV' && el.nodeName !== 'SPAN' && el.nodeName !== 'SECTION' && el.nodeName !== 'P') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role',
              lineNumber,
            ]);
          }
        }

        // timer role - unsure how to test for this?? specific to each use cases
        //
        case 'timer': {
          if (el.nodeName !== 'TIMER' && el.nodeName !== 'DIV') {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/timer_role',
              lineNumber,
            ]);
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
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alertdialog_role',
              lineNumber,
            ]);
          }
          break;
        }

        // dialog role requires either a aria-labelledby attr or aria-label (ONLY one, not BOTH)
        case 'dialog': {
          const label = el.getAttribute('aria-label');
          const labelledby = el.getAttribute('aria-labelledby');
          if ((!label && !labelledby) || (label && labelledby)) {
            incorrectRoleSupport.push([
              el,
              'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role',
              lineNumber,
            ]);
          }
          break;
        }

        // ABSTRACT ROLES: for browsers and dom org ONLY, not assigned by author

        // avoid using the following roles: application, article, cell, columnheader, definition, directory, document, figure, group, heading, img, list, listitem, meter, row, rowgroup, rowheader, seperator, table, term, button, checkbox, gridcell, link, menuitem, menuitemcheckbox, menuitemradio, option, progressbar, radio, textbox, grid, listbox, radiogroup, command, composite, input, landmark, range, roletype, section, sectionhead, select, structure, widget, and window.
        case 'application': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/application_role',
            lineNumber,
          ]);
          break;
        }
        case 'article': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/article_role',
            lineNumber,
          ]);
          break;
        }
        case 'cell': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/cell_role',
            lineNumber,
          ]);
          break;
        }
        case 'columnheader': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/columnheader_role',
            lineNumber,
          ]);
          break;
        }
        case 'definition': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/definition_role',
            lineNumber,
          ]);
          break;
        }
        case 'directory': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/directory_role',
            lineNumber,
          ]);
          break;
        }
        case 'document': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/document_role',
            lineNumber,
          ]);
          break;
        }
        case 'figure': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/figure_role',
            lineNumber,
          ]);
          break;
        }
        case 'group': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/group_role',
            lineNumber,
          ]);
          break;
        }
        case 'heading': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/heading_role',
            lineNumber,
          ]);
          break;
        }
        case 'img': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role',
            lineNumber,
          ]);
          break;
        }
        case 'list': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/list_role',
            lineNumber,
          ]);
          break;
        }
        case 'listitem': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listitem_role',
            lineNumber,
          ]);
          break;
        }
        case 'meter': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/meter_role',
            lineNumber,
          ]);
          break;
        }
        case 'row': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/row_role',
            lineNumber,
          ]);
          break;
        }
        case 'rowgroup': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/rowgroup_role',
            lineNumber,
          ]);
          break;
        }
        case 'rowheader': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/rowheader_role',
            lineNumber,
          ]);
          break;
        }
        case 'separator': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/separator_role',
            lineNumber,
          ]);
          break;
        }
        case 'table': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/table_role',
            lineNumber,
          ]);
          break;
        }
        case 'term': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/term_role',
            lineNumber,
          ]);
          break;
        }
        case 'button': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role',
            lineNumber,
          ]);
          break;
        }
        case 'checkbox': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role',
            lineNumber,
          ]);
          break;
        }
        case 'gridcell': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/gridcell_role',
            lineNumber,
          ]);
          break;
        }
        case 'link': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/link_role',
            lineNumber,
          ]);
          break;
        }
        case 'menuitem': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitem_role',
            lineNumber,
          ]);
          break;
        }
        case 'menuitemcheckbox': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitemcheckbox_role',
            lineNumber,
          ]);
          break;
        }
        case 'menuitemradio': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitemradio_role',
            lineNumber,
          ]);
          break;
        }
        case 'option': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/option_role',
            lineNumber,
          ]);
          break;
        }
        case 'progressbar': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role',
            lineNumber,
          ]);
          break;
        }
        case 'radio': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radio_role',
            lineNumber,
          ]);
          break;
        }
        case 'textbox': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/textbox_role',
            lineNumber,
          ]);
          break;
        }
        case 'grid': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/grid_role',
            lineNumber,
          ]);
          break;
        }
        case 'listbox': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role',
            lineNumber,
          ]);
          break;
        }
        case 'radiogroup': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radiogroup_role',
            lineNumber,
          ]);
          break;
        }
        case 'command': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/command_role',
            lineNumber,
          ]);
          break;
        }
        case 'composite': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/composite_role',
            lineNumber,
          ]);
          break;
        }
        case 'input': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/input_role',
            lineNumber,
          ]);
          break;
        }
        case 'landmark': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role',
            lineNumber,
          ]);
          break;
        }
        case 'range': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/range_role',
            lineNumber,
          ]);
          break;
        }
        case 'roletype': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/roletype_role',
            lineNumber,
          ]);
          break;
        }
        case 'section': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/section_role',
            lineNumber,
          ]);
          break;
        }
        case 'sectionhead': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/sectionhead_role',
            lineNumber,
          ]);
          break;
        }
        case 'select': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/select_role',
            lineNumber,
          ]);
          break;
        }
        case 'structure': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/structure_role',
            lineNumber,
          ]);
          break;
        }
        case 'widget': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/widget_role',
            lineNumber,
          ]);
          break;
        }
        case 'window': {
          incorrectRoleSupport.push([
            el,
            'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/window_role',
            lineNumber,
          ]);
          break;
        }
      }
    });

    // incorrectRoleSupport is nested arr of arrays:
    // arr[0] --> element on node list
    // arr[1] --> link to specific role documentation on mdn
    // arr[2] --> line number
    const roleSupportHtml = incorrectRoleSupport.map((arr) => [arr[0].outerHTML, arr[1], arr[2]]);
    return roleSupportHtml;
  }
}
