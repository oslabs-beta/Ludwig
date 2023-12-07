import React, { useState, useRef } from 'react';

export default function Score () {
  return (
    <div>
      <div>
        <h3>Your Ludwig Accessibility Score:</h3>
        <p>*score here*</p>
      </div>
      <div>
        <h3>Total Critical Issues</h3>
        <p>*total issues here</p>
      </div>
    </div>
  );
}