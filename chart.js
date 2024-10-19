var cityInput = document.getElementById("searchCity");

var alertThreshold = {
    temperature: 35, // Default threshold for temperature alerts
    consecutiveCount: 2, // Number of consecutive updates to trigger the alert
};

var weatherDataHistory = []; // Store historical temperature data
var consecutiveAlertCount = 0; // Track consecutive breaches

// Initialize Chart.js charts
var weatherSummaryChart, historicalTrendChart;

function initCharts() {
    var ctx1 = document.getElementById('weatherSummaryChart').getContext('2d');
    weatherSummaryChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: [], // Dates
            datasets: [{
                label: 'Max Temperature (°C)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                data: [] // Max temperatures
            }, {
                label: 'Min Temperature (°C)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: [] // Min temperatures
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var ctx2 = document.getElementById('historicalTrendChart').getContext('2d');
    historicalTrendChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [], // Dates for historical data
            datasets: [{
                label: 'Temperature (°C)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [] // Temperature history
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to update the charts
function updateCharts(dailyForecasts, historicalData) {
    // Update daily weather summary chart
    var dates = Object.keys(dailyForecasts);
    var maxTemps = dates.map(date => dailyForecasts[date].maxTemp - 273.15); // Convert to Celsius
    var minTemps = dates.map(date => dailyForecasts[date].minTemp - 273.15);

    weatherSummaryChart.data.labels = dates;
    weatherSummaryChart.data.datasets[0].data = maxTemps;
    weatherSummaryChart.data.datasets[1].data = minTemps;
    weatherSummaryChart.update();

    // Update historical trend chart
    var historicalDates = historicalData.map(item => new Date(item.timestamp).toLocaleDateString());
    var historicalTemps = historicalData.map(item => item.temperature);

    historicalTrendChart.data.labels = historicalDates;
    historicalTrendChart.data.datasets[0].data = historicalTemps;
    historicalTrendChart.update();
}

// Function to display triggered alerts
function triggerAlert(weatherData) {
    var alertContainer = document.getElementById('alertContainer');
    var alertDiv = document.createElement('div');
    alertDiv.classList.add('alerts-container');
    alertDiv.innerHTML = `⚠️ Alert! The temperature in ${weatherData.name} is ${weatherData.main.temp}°C, which exceeds ${alertThreshold.temperature}°C for ${alertThreshold.consecutiveCount} consecutive updates.`;
    alertContainer.appendChild(alertDiv);
}

// Initialize charts
initCharts();

