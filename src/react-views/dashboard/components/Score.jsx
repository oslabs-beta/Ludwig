import React, { memo } from 'react';
import Pie from './Pie';
import Doughnut from './Doughnut';

function Score({ ariaRecommendations }) {
  // count inaccessible elements
  console.log('Score.jsxAria Recommendations:', ariaRecommendations);

  let inaccessibleCount = 0;
  for (const ariaObjKey of Object.keys(ariaRecommendations)) {
    // skip totalElements and criticalIssuesByType keys
    if (ariaObjKey === 'totalElements' || ariaObjKey === 'criticalIssuesByType') {
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

  const criticalIssuesCount = ariaRecommendations.criticalIssuesByType;

  return (
    <div>
      <h2>Your Ludwig Accessibility Score:</h2>
      <Pie props={{ recData: scoreData }} />
      <h2>Critical Issues:</h2>
      <Doughnut props={{ recData: criticalIssuesCount }} />
      <h2>Total Accessibility Issues Found:</h2>
      <h1 className="circle">
        <span>{inaccessibleCount}</span>
      </h1>
    </div>
  );
}

export default memo(Score);
