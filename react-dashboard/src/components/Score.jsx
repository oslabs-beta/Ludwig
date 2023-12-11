import React, { useState, useRef, memo } from 'react';
import Panel from './Panel';

function Score ({recommendations}) {
  return (
    // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <div>
      <h2>Your Ludwig Accessibility Score:</h2>
      <Panel />
      <h2>Total Issues Found:</h2>
      <h1 className='circle'><span>{Object.keys(recommendations).length}</span></h1>
    </div>
  );
}


export default memo(Score);