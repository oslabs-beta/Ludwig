import React, { useState, useRef } from 'react';

export default function Issues ({recommendations}) {
  
  const elements = Object.keys(recommendations).map((el) => {
    return(
      <tr key={crypto.randomUUID()} >
          <td>Line #</td>
          <td><code>{el}</code></td>
          <td>{recommendations[el]['desc']}</td>
          <td><a href={recommendations[el]['link']}>Link</a></td>
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