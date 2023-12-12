import React, { useState, useRef, memo } from 'react';

function Issues ({recommendations}) {
  
  const elements = Object.keys(recommendations).map((el) => {
    return(
      <tr key={crypto.randomUUID()} >
          <td>Line #{el}</td>
          <td><code>{recommendations[el][1]}</code></td>
          <td>{recommendations[el][0]['desc']}</td>
          <td><a href={recommendations[el][0]['link']}>Link</a></td>
      </tr>
    );
  });
  return(
    <>
    <h2>Summary of Issues:</h2>
      <table>
        <thead>
          <tr>
            <th>Line Number</th>
            <th>Element</th>
            <th>Recommendation</th>
            <th>Further Reading</th>
          </tr>
        </thead>
        <tbody>
          {elements}
        </tbody>
      </table>
    </>
  );
}

export default memo(Issues);