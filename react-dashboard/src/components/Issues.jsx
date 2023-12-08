import React, { useState, useRef } from 'react';

export default function Issues ({recommendations}) {
  
  const elements = Object.keys(recommendations).map((el) => {
    return (
    <>
      <li key={crypto.randomUUID()}><b>Element: </b> <code>{el}</code></li>
      <ul>
        <li>Recommendation: {recommendations[el]['desc']} (<a href={recommendations[el]['link']}>Read More</a>)</li>
      </ul>
      {"\b"}
    </>
    );
  });

  return (
    <div>
      <h4>Found Issues:</h4>
      <ol>
        {elements}
      </ol>
    </div>
  );
}