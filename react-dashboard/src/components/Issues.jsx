import React, { useState, useRef } from 'react';

export default function Issues ({recommendations}) {
  
  return (
    <div>
      <h4>Issue Descriptions:</h4>
      <ol>
        <li>Issue description. (<a href="#">highlight code</a>) (<a href="#">read more</a>)</li>
      </ol>
    </div>
  );
}