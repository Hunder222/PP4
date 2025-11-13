
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
const allNavButtons = document.querySelectorAll("button")


const titel1 = document.querySelector('#titil1')

const backgroundElement = document.querySelector('.backgroundImg');
const logoElement=document.getElementById("logo")

//  colors
const chartLabelgrid = 'hsla(0, 5%, 75%,0.75)'


let barChart = new Chart(barChartCanvas,{
    type: 'bar',
    data: {
        labels: [], // edited by updateCharts
        datasets: [{
            label: '', // edited by updateCharts
            data: [], // edited by updateCharts
            backgroundColor: '', // edited by updateCharts
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverBorderColor: '#ccc'
        }]
    },
    options: {
        transitions: {
            active: {
                animation: {
                    duration: 300, // 0.3s (in milliseconds)
                    easing: 'linear'
                }
            }
        },

            // ... andre indstillinger ...
            maintainAspectRatio: false,

            layout: {
                padding: {
                    top: 1,
                    bottom: 1,
                    left: 50,
                    right: 10
                }


            },




        plugins: {
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
        scales: {
            // Indstillinger for X-aksen
            x: {
                // Tilføjet farveindstillinger for grid
                grid: {
                    color: chartLabelgrid, // Grid-linjer (let gennemsigtig hvid)
                    borderColor: chartLabelgrid // Akse linjen
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    color: chartLabelgrid,

                    // Din eksisterende callback-funktion for lange labels
                    callback: function (value) {
                        const label = this.getLabelForValue(value);
                        const maxLength = 20;

                        if (label.length > maxLength) {
                            return label.substring(0, maxLength) + '...';
                        } else {
                            return label;
                        }
                    }
                }
            },

            // Tilføjet Y-aksen for at indstille farver der også
            y: {
                grid: {
                    color: chartLabelgrid, // Grid-linjer (let gennemsigtig hvid)
                    borderColor: chartLabelgrid// Akse linjen
                },
                ticks: {
                    color: chartLabelgrid // Labels på Y-aksen
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
    const allNavButtons = document.querySelectorAll("button")
    allNavButtons.forEach(btn => {
        btn.style.backgroundColor = "#535353"
    })

    if (chartType === 'topSongs') {
        chartTitle = "Top 10 Songs"
        chartColor = 'rgba(54, 162, 235, 0.9)'
        btnSongs.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(0deg)`
        logoElement.style.filter =`hue-rotate(0deg)`;
    } else if (chartType === 'topGenres') {
        chartTitle = "Top 10 Genres"
        chartColor = 'rgba(75, 192, 192, 0.9)'
        btnGenres.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(-45deg)`
        logoElement.style.filter =`hue-rotate(-45deg)`;
    } else if (chartType === 'topArtists') {
        chartTitle = "Top 10 Artists"
        chartColor = 'rgba(153, 102, 255, 0.9)'
        btnArtists.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(50deg)`
        logoElement.style.filter =`hue-rotate(50deg)`;
    } else if (chartType === 'topCountries') {
        chartTitle = "Top 10 Countries"
        chartColor = 'rgba(255, 159, 64, 0.9)'
        btnCountries.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(180deg)`
        logoElement.style.filter =`hue-rotate(180deg)`;
    }

    // update barChart data and options:
    barChart.data.labels = newLabels
    barChart.data.datasets[0].data = newData
    barChart.data.datasets[0].label = chartTitle
    barChart.data.datasets[0].backgroundColor = chartColor
    titel1.innerText = chartTitle

    const MOBILE_BREAKPOINT = 1000;


    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;


    if (isMobile) {

        barChart.options.layout.padding.left = 20;
        barChart.options.layout.padding.right = 20;





        barChart.options.scales.y.ticks.maxRotation = 20;
        barChart.options.scales.y.ticks.minRotation = 20;
        barChart.options.scales.y.ticks.autoSkip = false;








        barChart.options.scales.x.ticks.maxRotation = 45;
        barChart.options.scales.x.ticks.minRotation = 45;
        barChart.options.scales.x.ticks.autoSkip = false;

    } else {

        barChart.options.layout.padding.left = 100;
        barChart.options.layout.padding.right = 100;

        barChart.options.scales.x.ticks.maxRotation = 0;
        barChart.options.scales.x.ticks.minRotation = 0;
        barChart.options.scales.x.ticks.autoSkip = true;
    }



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


// fetches from nodeJS / mysql2 server when connected, otherwise gets date from a local database
// the local database is updated by server.js, every time it successfully queries from mysql.
function dataFetcher(chartType) {

    const endpoint = '/api/' + chartType


    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const chartLabels = data.queriedLabels
            const chartData = data.queriedData

            updateCharts(chartLabels, chartData, chartType)
        })
        .catch(error => {
            console.log("Fetch to server failed, let's use localDB instead!");

            const localData = localDatabase[chartType]

            const chartLabels = localData.labels
            const chartData = localData.data

            updateCharts(chartLabels, chartData, chartType)
        })
}

// load top songs chart on site init:
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


// resize for mobil

    window.addEventListener('resize', () => {


        if (barChart) barChart.update();
    });


});





