import React, { useState, useRef } from 'react';
import Panel from './Panel';

export default function Score ({recommendations}) {
  return (
    <div >
      <h3>Your Ludwig Accessibility Score:</h3>
      <Panel />
      <h3>Total Issues Found:</h3>
      <h1 className='circle'><span>{Object.keys(recommendations).length}</span></h1>
    </div>
  );
}