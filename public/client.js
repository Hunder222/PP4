
// TODO save queries as json file
    // TODO add try: when fetching (when theres no nodeJS or sql server)


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
const allNavButtons = document.querySelectorAll("button")


const titel1= document.querySelector('#titil1')

const backgroundElement = document.querySelector('.backgroundImg');



let barChart = new Chart(barChartCanvas, {
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
                    color: 'hsla(0, 5%, 75%, 0.75)', // Grid-linjer (let gennemsigtig hvid)
                    borderColor: 'hsla(0, 5%, 75%,0.75)' // Akse linjen
                },
                ticks: {
                    // Tilføjet farveindstilling for labels (teksten)
                    color: 'hsla(0, 5%, 75%,1)',

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
                    color: 'hsl(0, 5%, 75%)', // Grid-linjer (let gennemsigtig hvid)
                    borderColor:'hsl(0, 5%, 75%)'// Akse linjen
                },
                ticks: {
                    color: 'hsl(0, 5%, 75%)' // Labels på Y-aksen
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

    allNavButtons.forEach(btn=>{
        btn.style.backgroundColor = "#535353"
    })

    if (chartType === 'top') {
        chartTitle = "Top 10 Songs"
        chartColor = 'rgba(54, 162, 235, 0.9)'
        // btnTop.style.s
        btnTop.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(0deg)`;
    } else if (chartType === 'genres') {
        chartTitle = "Top 10 Genres"
        chartColor = 'rgba(75, 192, 192, 0.9)'
        btnGenres.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(-45deg)`;
    } else if (chartType === 'artists') {
        chartTitle = "Top 10 Artists"
        chartColor = 'rgba(153, 102, 255, 0.9)'
        btnArtists.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(50deg)`;
    } else if (chartType === 'countries') {
        chartTitle = "Top 10 Countries"
        chartColor = 'rgba(255, 159, 64, 0.9)'
        btnCountries.style.backgroundColor=chartColor
        titel1.style.backgroundColor=chartColor
        backgroundElement.style.filter = `hue-rotate(180deg)`;
    }

    // update barChart data and options:
    barChart.data.labels = newLabels
    barChart.data.datasets[0].data = newData
    barChart.data.datasets[0].label = chartTitle
    barChart.data.datasets[0].backgroundColor = chartColor
    titel1.innerText=chartTitle

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

function updateLocalDB(newLabels, newData, chartType){

    try {
        const oldDbData = fs.readFileSync('/localDB.json')
        const database = JSON.parse(oldDbData)
        


    } catch (error) {
        
    }

    array.forEach(btn => {
        
    });



    if (chartType == 'top') {

    } else if (chartType == 'genres') {

    } else if (chartType == 'artists') {
        
    } else if (chartType == 'countries') {

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
            updateLocalDB(chartLabels, chartData, chartType)
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

const titel= document.querySelector('#titil1')



