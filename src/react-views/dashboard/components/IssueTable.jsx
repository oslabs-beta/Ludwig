import { ariaObject } from '../../../logic/aria-standards/aria-object';
import React, { memo } from 'react';
// import { randomUUID } from 'crypto';
let seed = 2653; // Initial seed value

function customRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
function IssueTable({ ariaObjKey, data }) {
  const elements = data.map((el) => {
    return (
      // <tr key={randomUUID()}>
      <tr key={customRandom()}>
        <td>{el[0]}</td>
        <td>
          <code>{el[1]}</code>
        </td>
        <td>
          <a href={ariaObject[ariaObjKey].link}>Link</a>
        </td>
      </tr>
    );
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Line Number</th>
            <th>Element</th>
            <th>Further Reading</th>
          </tr>
        </thead>
        <tbody>{elements}</tbody>
      </table>
    </>
  );
}

export default memo(IssueTable);
