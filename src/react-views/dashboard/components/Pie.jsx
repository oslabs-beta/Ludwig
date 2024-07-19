import React, { useMemo, memo } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

function Pie({ props }) {
  const data = props.recData;

  const pieSize = 300;
  const colorScale = ['#14532d', '#7f1d1d'];

  const chartData = data.map((d, index) => ({
    title: d.x,
    value: d.y,
    color: colorScale[index % colorScale.length],
  }));

  const centerText = useMemo(() => {
    if (data.length > 0) {
      const percentage = ((data[0].y / (data[0].y + data[1].y)) * 100).toFixed(
        0
      );
      return `${percentage}%`;
    }

    console.log('Chart Data:', chartData);
console.log('Center Text:', centerText);
    return '';
  }, [data]);

  if (data.length === 0) {
    return (
      <h3 className="critical-small">
        Score unavailable, please activate an HTML document before scanning
      </h3>
    );
  }

  return (
    <div
      className="panelContainer"
      style={{
        width: 350,
        height: pieSize,
        position: 'relative',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Container shadow
        borderRadius: '10px',
        overflow: 'hidden',
        padding: '10px',
        background: '#1c1c1c',
      }}
    >
      <PieChart
        data={chartData}
        lineWidth={60}
        startAngle={0}
        lengthAngle={360}
        paddingAngle={2}
        radius={50}
        viewBoxSize={[100, 100]}
        segmentsStyle={{
          transition: 'stroke 0.3s',
          cursor: 'pointer',
          filter: 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.3))', // Segment shadow for depth
        }}
        animate
        animationDuration={2000} // 2 seconds animation duration
        style={{ height: '100%', width: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#ffffff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Add text shadow for better readability
        }}
      >
        {centerText}
      </div>
    </div>
  );
}

export default memo(Pie);
