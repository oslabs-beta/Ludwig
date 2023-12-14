import React, { useState, useRef, memo } from 'react';
import Bar from './Bar';

function Score ({recommendations}) {

  return (
    <div>
      <h2>Your Ludwig Accessibility Score:</h2>
      <Bar recommendations = {recommendations}/>
      <h2>Total Accessibility Issues Found:</h2>
      <h1 className='circle'><span>{Object.keys(recommendations.data).length}</span></h1>
    </div>
  );
}


export default memo(Score);