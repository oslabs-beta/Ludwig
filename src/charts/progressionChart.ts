interface ChartMessage {
  command: string;
  errorCount?: number;
  warnings?: number;
  data?: {
    labels: string[];
    errorCounts: number[];
    warnings: number[];
  };
}

async function createChart(): Promise<any> {
  const { default: Chart } = await import('chart.js/auto');
  const ctx = (document.getElementById('progressionChart') as HTMLCanvasElement).getContext(
    '2d'
  ) as CanvasRenderingContext2D;
  const progressionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [] as string[],
      datasets: [
        {
          label: 'Errors Over Time',
          data: [] as number[],
          borderColor: 'rgba(224, 17, 73, 1)',
          borderWidth: 1,
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Warnings Over Time',
          data: [] as number[],
          borderColor: 'rgba(251, 200, 49, 1)',
          borderWidth: 1,
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  return progressionChart;
}

let chart: any;

createChart().then((createdChart) => {
  chart = createdChart;

  window.addEventListener('message', (event: MessageEvent<ChartMessage>) => {
    const message = event.data;
    switch (message.command) {
      case 'updateErrors': {
        const timestamp = new Date().toLocaleTimeString();

        (chart.data.labels as string[]).push(timestamp);
        (chart.data.datasets[0].data as number[]).push(message.errorCount || 0);
        (chart.data.datasets[1].data as number[]).push(message.warnings || 0);
        chart.update();
        break;
      }
      case 'loadData': {
        const data = message.data;
        if (data) {
          chart.data.labels = data.labels;
          chart.data.datasets[0].data = data.errorCounts;
          chart.data.datasets[1].data = data.warnings;
          chart.update();
        }
        break;
      }
    }
  });
});
