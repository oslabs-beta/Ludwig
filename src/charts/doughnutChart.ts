interface ChartMessage {
  command: string;
  data?: {
    labels: string[];
    errorCounts: number[];
  };
}

async function createDoughnutChart(): Promise<any> {
  const { default: Chart } = await import('chart.js/auto');
  const ctx = (document.getElementById('eslintChart') as HTMLCanvasElement).getContext(
    '2d'
  ) as CanvasRenderingContext2D;
  const doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [] as string[],
      datasets: [
        {
          data: [] as number[],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            font: {
              size: 10,
            },
          },
        },
        title: {
          display: true,
          text: 'Critical Errors',
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += context.parsed + ' occurrences';
              }
              return label;
            },
          },
        },
      },
      cutout: '50%',
    },
  });
  return doughnutChart;
}

function generateColors(count: number): string[] {
  const colorPalette = [
    'rgb(255, 140, 0)',
    'rgb(72, 61, 139)',
    'rgb(138, 51, 36)',
    'rgb(47, 79, 79)',
    'rgb(219, 112, 147)',
    'rgb(139, 69, 19)',
    'rgb(154, 205, 50)',
    'rgb(210, 105, 30)',
    'rgb(65, 105, 225)',
    'rgb(222, 184, 135)',
    'rgb(0, 206, 209)',
    'rgb(250, 128, 114)',
    'rgb(34, 139, 34)',
    'rgb(199, 21, 133)',
    'rgb(205, 92, 92)',
    'rgb(32, 178, 170)',
    'rgb(112, 128, 144)',
    'rgb(255, 99, 71)',
  ];

  const colors = [];

  for (let i = 0; i < count; i++) {
    colors.push(colorPalette[i % colorPalette.length]);
  }

  return colors;
}

let chart: any;

createDoughnutChart().then((createdChart) => {
  console.log('Chart created');
  chart = createdChart;

  window.addEventListener('message', (event: MessageEvent<ChartMessage>) => {
    console.log('Received message:', event.data);
    const message = event.data;
    switch (message.command) {
      case 'loadData': {
        console.log('Received loadData command');
        const data = message.data;
        if (data) {
          const labels = data.labels;
          const errorCounts = data.errorCounts;

          const colors = generateColors(labels.length);
          chart.data.labels = labels; // array of ruleIds ["ruleId1", "ruleId2", ...]
          chart.data.datasets[0].data = errorCounts; // array of errorCounts [1, 34, 34
          chart.data.datasets[0].backgroundColor = colors;
          chart.data.datasets[0].borderColor = colors.map((color) => color.replace('0.8', '1'));
          chart.update();
        }
        break;
      }
    }
  });
});
