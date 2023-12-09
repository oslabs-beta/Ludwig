import React, {Suspense} from 'react';
import { VictoryPie, VictoryLabel } from 'victory';

// // Lazy load the VictoryPie and VictoryLabel components
// const LazyVictoryPie = React.lazy(() => import('victory').then(({ VictoryPie }) => ({ default: VictoryPie })));
// const LazyVictoryLabel = React.lazy(() => import('victory').then(({ VictoryLabel }) => ({ default: VictoryLabel })));

export default function Panel() {
  const data = [
    { x: 'Accessible', y: 73 },
    { x: 'Inaccessible', y: 27 },
  ];

  const colorScale = ["#3a4750", "#be3144"];
  const pieSize = 400; // Size of the VictoryPie
  const centerX = pieSize / 2;
  const centerY = pieSize / 2;

  // Calculate the center coordinates

  return (  
    <div className='panelContainer' >
      <VictoryPie
        padAngle={2}
        innerRadius={100}
        width={pieSize}
        height={pieSize}
        data={data}
        colorScale={colorScale}
      />
      <VictoryLabel
        text={`${data[0].y}%`}
        textAnchor="middle"
        verticalAnchor="middle"
        style={{ fontSize: 50, fill: '#d3d6db', position: 'absolute', top: centerY-25, left: centerX - 75}}
      />
    </div>
  );
}