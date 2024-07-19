import Chart from 'chart.js/auto';

//prevent too many updates to chart so can only run it after certain amount of time
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function createChart() {
  const ctx = document.getElementById('progressionChart').getContext('2d');
  const progressionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Errors Over Time',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
  return progressionChart;
}

let chart = createChart();

const updateChart = debounce((message) => {
  const timestamp = new Date().toLocaleTimeString();
  
  
  if (chart.data.labels.length >= 100) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  
  chart.data.labels.push(timestamp);
  chart.data.datasets[0].data.push(message.errorCount);
  chart.update();
}, 500);  

window.addEventListener('message', event => {
  const message = event.data;
  switch (message.command) {
    case 'updateErrors':
      updateChart(message);
      break;
  }
});
