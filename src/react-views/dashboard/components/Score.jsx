import React, { memo } from 'react';
import Pie from './Pie';

function Score ({ariaRecommendations}) {
  // count inaccessible elements
  let inaccessibleCount = 0;
  for (const ariaObjKey of Object.keys(ariaRecommendations)) {
    // skip totalElements key
    if (ariaObjKey === 'totalElements') {
      continue;
    }
    inaccessibleCount += ariaRecommendations[ariaObjKey].length;
  }

  const accessibleCount = ariaRecommendations.totalElements - inaccessibleCount;

  // format data for Pie component
  const scoreData = [
    { x: 'Accessible', y: accessibleCount },
    { x: 'Inaccessible', y: inaccessibleCount },
  ];

  return (
    <div>
      <h2>Your Ludwig Accessibility Score:</h2>
      <Pie scoreData = {scoreData}/>
      <h2>Total Accessibility Issues Found:</h2>
      <h1 className='circle'><span>{inaccessibleCount}</span></h1>
    </div>
  );
}


export default memo(Score);