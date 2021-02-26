const countryToCode = {
    'Global': '', 'Argentina': 'ar', 'Australia': 'au', 'Austria': 'at', 'Belgium': 'be', 'Brazil': 'br', 'Bulgaria': 'bg', 'Canada': 'ca', 'China': 'cn', 'Colombia': 'co', 'Cuba': 'cu', 'Czech Republic': 'cz', 'Egypt': 'eg', 'France': 'fr', 'Germany': 'de', 'Greece': 'gr', 'Hong Kong': 'hk', 'Hungary': 'hu', 'India': 'in', 'Indonesia': 'id', 'Ireland': 'ie', 'Israel': 'il', 'Italy': 'it', 'Japan': 'jp', 'Latvia': 'lv', 'Lithuania': 'lt', 'Malaysia': 'my', 'Mexico': 'mx', 'Morocco': 'ma', 'Netherlands': 'nl', 'New Zealand': 'nz', 'Nigeria': 'ng', 'Norway': 'no', 'Philippines': 'ph', 'Poland': 'pl', 'Portugal': 'pt', 'Romania': 'ro', 'Russia': 'ru', 'Saudi Arabia': 'sa', 'Serbia': 'rs', 'Singapore': 'sg', 'Slovakia': 'sk', 'Slovenia': 'si', 'South Africa': 'za', 'South Korea': 'kr', 'Sweden': 'se', 'Switzerland': 'ch', 'Taiwan': 'tw', 'Thailand': 'th', 'Turkey': 'tr', 'UAE': 'ae', 'Ukraine': 'ua', 'United Kingdom': 'gb', 'United States': 'us', 'Venuzuela': 've'
}
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const attributes = ['totalcases', 'totaldeaths', 'totalrecovered'];
const labels = ['\u2623 Total Cases', '\u2620 Total Deaths', '\u271A Total Recovered'];
let statistics = {};

let chart = null;

let statisticsDiv = document.getElementById('statistics-div');
let newsDiv = document.getElementById('news-div');

$( document ).ready(function() {
    const proxy = 'http://localhost:8080/';
    const apiEndpoint = `${proxy}https://newsapi.org/v2/top-headlines?q=covid&language=en`;
    const apiKey = config.API_KEY;
    let countryDropdown = document.getElementById('country');

    for(let country in countryToCode) {
        let option = document.createElement('option');
        option.innerText = country;
        countryDropdown.appendChild(option);
    }

    statisticsDiv.style.display = 'none';
    newsDiv.style.display = 'none';

    $.ajax({
        url: `https://raw.githubusercontent.com/zenilharia26/Cov-IP/main/covid_data.xml?token=${config.XML_TOKEN}`,
        method: 'GET',
        success: function(response) {
            parseXml(response);
            document.getElementById('content').style.display = 'block';
        }
    });

    $("#filter-button").click(function() {
        const country = document.getElementById('country').value
        const countryId = countryToCode[country];
        const url = apiEndpoint + '&country=' + countryId + '&apiKey=' + apiKey;
        $.ajax({
            url: url,
            method: 'GET',
            success: function(response) {
                loadNews(response);
            }
        })

        statisticsDiv.style.display = 'block';
        newsDiv.style.display = 'none';

        plotStatistics(country);
    });
});

function loadNews(news) {
    newsList = document.getElementById('news-list');
    newsList.innerHTML = "";

    for(let article of news['articles']) {
        var listItem = document.createElement('li');
        var heading = document.createElement('h4');
        heading.innerText = article['title'];
        listItem.appendChild(heading);
        listItem.classList.add('list-group-item');
        newsList.appendChild(listItem);

        listItem.addEventListener("click", () => {
            document.getElementById("news-heading").innerText = article['title'];
            document.getElementById("news-date").innerText = getDate(article['publishedAt']);
            document.getElementById("news-description").innerText = article['description'];
            document.getElementById("news-url").innerHTML = "Read More";
            document.getElementById("news-url").href = article['url'];
            document.getElementById("news-url").target = "_blank";
            newsDiv.style.display = 'block';
        });
    }
    
    $('#news-list > li').click(function() {
        $('#news-list > li').removeClass('active');
        $(this).addClass('active');
    });
}

function getDate(date) {
    const newDate = new Date(date);
    const weekday = weekdays[newDate.getDay()];
    const monthDay = parseInt(newDate.getDate());
    const month = months[newDate.getMonth()];
    const year = newDate.getFullYear();

    console.log(monthDay);

    let dateString = `${weekday}, ${monthDay}`;
    switch(monthDay%10) {
        case 1:
            dateString += 'st ';
            break;
        case 2:
            dateString += 'nd ';
            break;
        case 3:
            dateString += 'rd ';
            break;
        default:
            dateString += 'th ';
            break;
    }
    dateString += `${month}, ${year}`;
    return dateString;
}

function parseXml(xml) {
    let parser = new DOMParser();
    let xmlDocument = parser.parseFromString(xml, "text/xml");
    let data = xmlDocument.getElementsByTagName("data");

    for(let i = 0;i < data.length;i++) {
        let row = {};
        for(let j = 0;j < data[i].children.length;j++) {
            row[data[i].children[j].localName] = data[i].children[j].textContent;
        }

        let country = row['country'];
        switch(country) {
            case 'USA':
                country = 'United States';
                break;

            case 'UK':
                country = 'United Kingdom';
                break;
            
            default:
                break;
        }

        statistics[country] = [];

        for(let attribute of attributes) {
            statistics[country].push(+row[attribute]);
        }
    }

    console.log(statistics);
}

function plotStatistics(country) {

    let context = document.getElementById('statistics-chart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(
        context, 
        {
            type: 'doughnut',
            fontSize: 20.0,
            data: {
                labels: labels,
                datasets: [{
                    data: statistics[country],
                    backgroundColor: ['#fcba03', '#fc0303', '#07e000'],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: true,
                    labels: {
                        fontSize: 15.0,

                    }
                }
            }
        }
    )
}