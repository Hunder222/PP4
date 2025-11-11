let barChartCanvas = document.getElementById('barChart').getContext('2d');
let tableChart = document.getElementById('tableChart');

let btnTop = document.getElementById('btnTop')
let btnGenres = document.getElementById('btnGenres')
let btnArtists = document.getElementById('btnArtists')
let btnCountries = document.getElementById('btnCountries')



let barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                // backgroundColor can be a single value or an array for different colors
                backgroundColor: '',
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            }]
        },

        // 3. Configuration options
        options: {
            title: {
                display: true,
                text: '',
                fontSize: 25
            },
            legend: {
                display: true, // or false to hide
                position: 'right', // 'top', 'bottom', 'left'
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 100,
                    right: 100,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true // false to disable tooltips
            }
        }
    });



function updateCharts(newLabels, newData, chartType) { // chartType: (top, genres, artists, countries), for using correct styles.

    // chart data specific settings:

    let chartTitle;
    let chartColor;

    if (chartType == 'top'){
        chartTitle = "Top 10 Songs"
        chartColor = 'rgba(54, 162, 235, 0.6)'
    } else if (chartType == 'genres'){
        chartTitle = "Top 10 Genres"
        chartColor = 'rgba(75, 192, 192, 0.6)'
    } else if (chartType == 'artists'){
        chartTitle = "Top 10 Artists"
        chartColor = 'rgba(153, 102, 255, 0.6)'
    } else if (chartType == 'countries'){
        chartTitle = "Top 10 Countries"
        chartColor = 'rgba(255, 159, 64, 0.6)'
    }

    // update barChart

    barChart.data.labels = newLabels
    barChart.data.datasets[0].data = newData
    barChart.data.datasets[0].label = chartTitle
    barChart.data.datasets[0].backgroundColor = chartColor
    barChart.options.title.text = chartTitle

    barChart.update()

    // update tableChart
}




btnTop.addEventListener('click', () => {
    console.log("btnTop pressed!");
    
    fetch('/api/top')
        .then(response => response.json())
        .then(data => {

            console.log('Got data from query 1:', data);

            const chartLabels = data.labels;
            const chartData = data.datas;

            updateCharts(chartLabels, chartData, 'top')
        })
        .catch(error => console.error('Error:', error));
});



btnGenres.addEventListener('click', () => {
    console.log("btnGenres pressed!");
    
    fetch('/api/genres')
        .then(response => response.json())
        .then(data => {
            
            console.log('Got data from query 1:', data);

            const chartLabels = data.labels;
            const chartData = data.datas;

            updateCharts(chartLabels, chartData, 'genres')
        })
        .catch(error => console.error('Error:', error));
});



btnArtists.addEventListener('click', () => {
    console.log("btnArtists pressed!");
    
    fetch('/api/artists')
        .then(response => response.json())
        .then(data => {
            
            console.log('Got data from query 1:', data);

            const chartLabels = data.labels;
            const chartData = data.datas;

            updateCharts(chartLabels, chartData, 'artists')
        })
        .catch(error => console.error('Error:', error));
});



btnCountries.addEventListener('click', () => {
    console.log("btnCountries pressed!");
    
    fetch('/api/countries')
        .then(response => response.json())
        .then(data => {
            
            console.log('Got data from query 1:', data);

            const chartLabels = data.labels;
            const chartData = data.datas;

            updateCharts(chartLabels, chartData, 'countries')
        })
        .catch(error => console.error('Error:', error));
});