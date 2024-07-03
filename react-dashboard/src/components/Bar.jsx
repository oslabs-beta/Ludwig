import React, { Suspense, useMemo, memo } from 'react';

// Lazy load the VictoryPie and VictoryLabel components
const LazyVictoryPie = React.lazy(() =>
  import('victory').then(({ VictoryPie }) => ({ default: VictoryPie }))
);
const LazyVictoryLabel = React.lazy(() =>
  import('victory').then(({ VictoryLabel }) => ({ default: VictoryLabel }))
);

//Component to style text on progress bar
const BarText = ({ x, y, index, datum }) => {
  const textColor = '#d3d6db';
  const fontSize = 17;
  return (
    <text x={x} y={y} textAnchor="middle" style={{ fill: textColor, fontSize }}>
      {datum.x}
    </text>
  );
};

function Bar({ recommendations }) {
  const data = recommendations.recData;

  const colorScale = ['#3a4750', '#be3144'];
  const pieSize = 400; // Size of the VictoryPie

  // Calculate the center coordinates
  const { centerX, centerY } = useMemo(() => {
    const centerX = pieSize / 2;
    const centerY = pieSize / 2;
    return { centerX, centerY };
  }, [pieSize]);

  // if (data.length === 0) {
  //     return <h3 className='critical-small'>Score unavailable, please activate an HTML document before scanning</h3>;
  // }
  return (
    <div className="panelContainer" style={{ width: 350 }}>
      {/* in case lazy-loaded components are not yet available */}
      <Suspense fallback={<div>Loading...</div>}>
        <LazyVictoryPie
          padAngle={2}
          innerRadius={100}
          width={pieSize}
          height={pieSize}
          data={data}
          colorScale={colorScale}
          style={{ position: 'relative' }}
          labelComponent={<BarText />}
        />
        <LazyVictoryLabel
          text={`${((data[0].y / (data[0].y + data[1].y)) * 100).toFixed(0)}%`}
          textAnchor="middle"
          verticalAnchor="middle"
          style={{
            fontSize: 50,
            fill: '#d3d6db',
            position: 'absolute',
            top: centerY - 25,
            left: centerX - 35,
          }}
        />
      </Suspense>
    </div>
  );
}

export default memo(Bar);
