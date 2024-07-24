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
          text: 'ESLint Rules Triggered',
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
  const baseColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF',
    '#7CFC00',
    '#00CED1',
    '#FF1493',
    '#32CD32',
    '#FFD700',
    '#8A2BE2',
    '#FF4500',
  ];

  // If we need more colors than in our base array, we'll generate them
  if (count > baseColors.length) {
    for (let i = baseColors.length; i < count; i++) {
      baseColors.push(`hsl(${Math.random() * 360}, 70%, 50%)`);
    }
  }

  return baseColors.slice(0, count);
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
