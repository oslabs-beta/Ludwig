import React, { useState, useRef } from 'react';

export default function Score ({recommendations}) {
  return (
    <div>
      <div>
        <h3>Your Ludwig Accessibility Score:</h3>
        <p>*score here*</p>
      </div>
      <div>
        <h3>Total Issues Found:</h3>
        <h1>{Object.keys(recommendations).length}</h1>
      </div>
    </div>
  );
}