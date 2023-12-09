import React, { useState, useRef, useEffect } from 'react';


export default function Menu () {
  const vscode = window.vscodeApi;

    const handleClick = (event) => {
      vscode.postMessage({ message: 'scanDoc' });
      console.log('clicked');
    };

  return (
    <div>
      <h3>Improve the accessibility of your website!</h3>
      <p>Click the button below to scan the current HTML document and generate a report to enhance your code</p>
      <button onClick={handleClick}>Scan Document</button>
    </div>
  );
}