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

//wait till full chart is created before adding data
createChart().then((createdChart) => {
  chart = createdChart;

  //Handle messages sent to webview
  window.addEventListener('message', (event: MessageEvent<ChartMessage>) => {
    //get event data
    const message = event.data;
    //determines the type of command in the message
    switch (message.command) {
      //this updateErrors message is used to add data to the chart dynamically if you want to add a single data point like linting one file after running command
      case 'updateErrors': {
        //get date as a string
        const timestamp = new Date().toLocaleTimeString();

        //add timestamp and errorCount to chart as data point
        (chart.data.labels as string[]).push(timestamp);
        (chart.data.datasets[0].data as number[]).push(message.errorCount || 0);
        (chart.data.datasets[1].data as number[]).push(message.warnings || 0);
        chart.update();
        break;
      }
      //this message loads the entire dataset into the chart, so if you wanted to initialize the chart with existing data from the json library so if you want all data
      case 'loadData': {
        //if there is data in the message
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
