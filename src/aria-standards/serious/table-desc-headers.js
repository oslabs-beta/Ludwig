// const vscode = require('vscode');
const { JSDOM } = require('jsdom');

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sample Title</title>
  </head>
  <body>
    <table>
        <tr>
          <th scope="col">State & First</th>
          <th scope="col">State & Sixth</th>
          <th scope="col">State & Fifteenth</th>
          <th scope="col">Fifteenth & Morrison</th>
        </tr>
      <tr>
        <td>4:00</td>
        <td>4:05</td>
        <td>4:11</td>
        <td>4:19</td>
      </tr>
    </table> 
  </body>
  `;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

// <th> elements and elements with role=columnheader OR role=rowheader have data cells they describes
function checkTableHeaders() {
  // const activeEditor = vscode.window.activeTextEditor;

  // if (activeEditor && activeEditor.document.languageId === 'html') {
  //   const htmlCode = activeEditor.document.getText();
  //   const { window } = new JSDOM(htmlCode);
  //   const document = window.document;
  //   const ludwig = document.body;
  
  const allElement = ludwig.querySelectorAll('*');
    // extract roles from every element
  const tableHeaderRoles = [];
  allElement.forEach((el) => {
    const role = el.getAttribute('role');
    if (role === 'columnheader' || role === 'rowheader') {
      tableHeaderRoles.push(el);
    }
  });
  console.log('TH ROLES ARR', tableHeaderRoles);

  const th = document.querySelectorAll('th');
  console.log('TH:', th);


  // }
}

console.log(checkTableHeaders());

// export to extension.ts
module.exports = {
  checkTableHeaders
};