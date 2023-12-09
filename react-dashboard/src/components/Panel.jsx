import React, { Suspense } from 'react';

// Lazy load the VictoryPie and VictoryLabel components
const LazyVictoryPie = React.lazy(() => import('victory').then(({ VictoryPie }) => ({ default: VictoryPie })));
const LazyVictoryLabel = React.lazy(() => import('victory').then(({ VictoryLabel }) => ({ default: VictoryLabel })));

const CustomLabel = ({ x, y, index, datum }) => {
  const textColor = '#d3d6db'; 
  const fontSize = 18;

  return (
    <text x={x} y={y} textAnchor="middle" style={{ fill: textColor, fontSize }}>
      {datum.x}
    </text>
  );
};


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
      {/* in case lazy-loaded compoenents are not yet available */}
      <Suspense fallback={<div>Loading...</div>}> 
        <LazyVictoryPie
          padAngle={2}
          innerRadius={100}
          width={pieSize}
          height={pieSize}
          data={data}
          colorScale={colorScale}
          labelComponent={<CustomLabel />}
        />
      <div style={{ position: 'absolute', top: centerY - 30, left: centerX - 75 }}>
        <LazyVictoryLabel
          text={`${data[0].y}%`}
          textAnchor="middle"
          verticalAnchor="middle"
          style={{ fontSize: 50, fill: '#d3d6db'}}
        />
      </div>
      </Suspense>
    </div>
  );
}