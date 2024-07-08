import React, { useState, useRef, memo } from 'react';

function IssueTable ({recommendations}) {
  
  const elements = Object.keys(recommendations.data).map((el) => {
    return(
      <tr key={crypto.randomUUID()} >
          <td>Line #{el}</td>
          <td><code>{recommendations.data[el][1]}</code></td>
          <td>{recommendations.data[el][0]['desc'].replaceAll('```','')}</td>
          <td><a href={recommendations.data[el][0]['link'] instanceof Array ? recommendations.data[el][0]['link'][0] : recommendations.data[el][0]['link']}>Link</a></td>
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

export default memo(IssueTable);