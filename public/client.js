

// get chart html containers:
let barChartCanvas = document.getElementById('barChart').getContext('2d');
let tableChartContainer = document.getElementById('tableChart');

// get table item template:
let tableItemTemplate = document.getElementById('tableItemTemplate')

// get html buttons:
let btnTop = document.getElementById('btnTop')
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



function updateCharts(newLabels, newData, chartType) { // chartType: (top, genres, artists, countries), for using correct styles.

    // chart type specific settings:
    let chartTitle;
    let chartColor;

    // alle knapper sort bg
    //
    const allNavButtons = document.querySelectorAll("button")
    allNavButtons.forEach(btn=>{
        btn.style.backgroundColor = "#535353"
    })

    if (chartType === 'top') {
        chartTitle = "Top 10 Songs"
        chartColor = 'rgba(54, 162, 235, 0.6)'
        // btnTop.style.s
        btnTop.style.backgroundColor=chartColor
    } else if (chartType === 'genres') {
        chartTitle = "Top 10 Genres"
        chartColor = 'rgba(75, 192, 192, 0.6)'
        btnGenres.style.backgroundColor=chartColor
    } else if (chartType === 'artists') {
        chartTitle = "Top 10 Artists"
        chartColor = 'rgba(153, 102, 255, 0.6)'
        btnArtists.style.backgroundColor=chartColor
    } else if (chartType === 'countries') {
        chartTitle = "Top 10 Countries"
        chartColor = 'rgba(255, 159, 64, 0.6)'
        btnCountries.style.backgroundColor=chartColor
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

        // make a new copy of li template
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

            console.log(`Got data from query ${chartType}:`, data);

            const chartLabels = data.queriedLabels
            const chartData = data.queriedData

            updateCharts(chartLabels, chartData, chartType)
        })
        .catch(error => console.error('Error:', error))
}

// load top 10 chart on site init:
dataFetcher('top')


// button event listeners:
btnTop.addEventListener('click', () => {
    console.log("btnTop pressed!");
    dataFetcher('top')
});

btnGenres.addEventListener('click', () => {
    console.log("btnGenres pressed!");
    dataFetcher('genres')
});

btnArtists.addEventListener('click', () => {
    console.log("btnArtists pressed!");
    dataFetcher('artists')
});

btnCountries.addEventListener('click', () => {
    console.log("btnCountries pressed!");
    dataFetcher('countries')
});

