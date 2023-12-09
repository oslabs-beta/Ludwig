import React, { useState, useRef } from 'react';
import Panel from './Panel';

export default function Score ({recommendations}) {
  return (
    <div >
      <h2>Your Ludwig Accessibility Score:</h2>
      <Panel />
      <h2>Total Issues Found:</h2>
      <h1 className='circle'><span>{Object.keys(recommendations).length}</span></h1>
      {'\b'}
    </div>
  );
}