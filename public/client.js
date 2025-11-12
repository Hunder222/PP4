
// TODO save queries as json file
// TODO add try: when fetching (when theres no nodeJS or sql server)


// get chart html containers:
let barChartCanvas = document.getElementById('barChart').getContext('2d');
let tableChartContainer = document.getElementById('tableChart');

// get table item template:
let tableItemTemplate = document.getElementById('tableItemTemplate')

// get html buttons:
let btnSongs = document.getElementById('btnSongs')
let btnGenres = document.getElementById('btnGenres')
let btnArtists = document.getElementById('btnArtists')
let btnCountries = document.getElementById('btnCountries')



let barChart = new Chart(barChartCanvas, {
    type: 'bar',
    data: {
        labels: [], // edited by updateCharts
        datasets: [{
            label: '', // edited by updateCharts
            data: [], // edited by updateCharts
            backgroundColor: '', // edited by updateCharts
            borderWidth: 2,
            borderColor: '#aaa',
            hoverBorderWidth: 3,
            hoverBorderColor: '#ccc'
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'test',
                position: 'top',
                font: {
                    size: 25
                }
            },
            legend: {
                display: false,
                position: 'bottom',
                labels: {
                    color: '#000'
                }
            }
        },
        layout: {
            padding: {
                left: 100,
                right: 100
            }
        },
        scales: { // the following code solves an issue where overflow from long labels push the charts padding/margin
            x: {
                ticks: {
                    // The callback function to find and edit long labels
                    // scales > x > ticks, is calling this callback function, for each label, data, etc being rendered on the chart
                    callback: function (value) {
                        // get label
                        const label = this.getLabelForValue(value);

                        const maxLength = 20; // max allowed label string length

                        // if string label is too long, replace ending with ... 
                        if (label.length > maxLength) {
                            // .substring method slices out an select part of a string 
                            return label.substring(0, maxLength) + '...';
                        } else {
                            return label;
                        }
                    }
                }
            }
        }
    }
});



function updateCharts(newLabels, newData, chartType) { // chartType: (topSongs, topGenres, topArtists, topCountries), for using correct styles.

    // chart type specific settings:
    let chartTitle;
    let chartColor;

    // alle knapper sort bg
    //
    const allNavButtons = document.querySelectorAll("button")
    allNavButtons.forEach(btn => {
        btn.style.backgroundColor = "#535353"
    })

    if (chartType === 'topSongs') {
        chartTitle = "Top 10 Songs"
        chartColor = 'rgba(54, 162, 235, 0.6)'
        // btnSongs.style.s
        btnSongs.style.backgroundColor = chartColor
    } else if (chartType === 'topGenres') {
        chartTitle = "Top 10 Genres"
        chartColor = 'rgba(75, 192, 192, 0.6)'
        btnGenres.style.backgroundColor = chartColor
    } else if (chartType === 'topArtists') {
        chartTitle = "Top 10 Artists"
        chartColor = 'rgba(153, 102, 255, 0.6)'
        btnArtists.style.backgroundColor = chartColor
    } else if (chartType === 'topCountries') {
        chartTitle = "Top 10 Countries"
        chartColor = 'rgba(255, 159, 64, 0.6)'
        btnCountries.style.backgroundColor = chartColor
    }

    // update barChart data and options:
    barChart.data.labels = newLabels
    barChart.data.datasets[0].data = newData
    barChart.data.datasets[0].label = chartTitle
    barChart.data.datasets[0].backgroundColor = chartColor
    barChart.options.plugins.title.text = chartTitle;

    barChart.update()


    // update tableChart:

    tableChartContainer.replaceChildren()

    for (let i = 0; i < newLabels.length; i++) {

        // makes a new copy of li template
        const newItem = tableItemTemplate.content.cloneNode(true);

        // change values and text in template
        newItem.querySelector('.itemRank').textContent = i + 1 + '.'
        newItem.querySelector('.itemText').textContent = newLabels[i]
        newItem.querySelector('.itemValue').textContent = newData[i]


        tableChartContainer.appendChild(newItem)
    }


}




function dataFetcher(chartType) {
    
    const endpoint = '/api/' + chartType

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const chartLabels = data.queriedLabels
            const chartData = data.queriedData

            updateCharts(chartLabels, chartData, chartType)
        })
        .catch(error => console.error('Error:', error))
}

// load top 10 chart on site init:
dataFetcher('topSongs')


// button event listeners:
btnSongs.addEventListener('click', () => {
    dataFetcher('topSongs')
});

btnGenres.addEventListener('click', () => {
    dataFetcher('topGenres')
});

btnArtists.addEventListener('click', () => {
    dataFetcher('topArtists')
});

btnCountries.addEventListener('click', () => {
    dataFetcher('topCountries')
});

