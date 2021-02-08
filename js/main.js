const countryToCode = {
    'Global': '', 'Argentina': 'ar', 'Australia': 'au', 'Austria': 'at', 'Belgium': 'be', 'Brazil': 'br', 'Bulgaria': 'bg', 'Canada': 'ca', 'China': 'cn', 'Colombia': 'co', 'Cuba': 'cu', 'Czech Republic': 'cz', 'Egypt': 'eg', 'France': 'fr', 'Germany': 'de', 'Greece': 'gr', 'Hong Kong': 'hk', 'Hungary': 'hu', 'India': 'in', 'Indonesia': 'id', 'Ireland': 'ie', 'Israel': 'il', 'Italy': 'it', 'Japan': 'jp', 'Latvia': 'lv', 'Lithuania': 'lt', 'Malaysia': 'my', 'Mexico': 'mx', 'Morocco': 'ma', 'Netherlands': 'nl', 'New Zealand': 'nz', 'Nigeria': 'ng', 'Norway': 'no', 'Philippines': 'ph', 'Poland': 'pl', 'Portugal': 'pt', 'Romania': 'ro', 'Russia': 'ru', 'Saudi Arabia': 'sa', 'Serbia': 'rs', 'Singapore': 'sg', 'Slovakia': 'sk', 'Slovenia': 'si', 'South Africa': 'za', 'South Korea': 'kr', 'Sweden': 'se', 'Switzerland': 'ch', 'Taiwan': 'tw', 'Thailand': 'th', 'Turkey': 'tr', 'UAE': 'ae', 'Ukraine': 'ua', 'United Kingdom': 'gb', 'United States': 'us', 'Venuzuela': 've'
}
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

$( document ).ready(function() {
    const proxy = 'http://localhost:8080/';
    const apiEndpoint = `${proxy}https://newsapi.org/v2/top-headlines?q=covid&language=en&source=the-hindu`;
    //const apiKey = '7fcff72941a749f596ca167c566fd14e'; //Arghyadeep
    const apiKey = '148162a1b18c4fb092bbf0fe2a2d2885'; //Zenil
    let countryDropdown = document.getElementById('country');

    for(let country in countryToCode) {
        let option = document.createElement('option');
        option.innerText = country;
        countryDropdown.appendChild(option);
    }

    $("#filter-button").click(function() {
        const countryId = countryToCode[document.getElementById('country').value];
        const url = apiEndpoint + '&country=' + countryId + '&apiKey=' + apiKey;
        $.ajax({
            url: url,
            method: 'GET',
            success: function(response) {
                loadNews(response);
            }
        })
    });

    $("#toggle").click(function() {
        let newsDiv = document.getElementById('news');
        if (newsDiv.style.display == 'none') {
            newsDiv.style.display = 'block';
        } else {
            newsDiv.style.display = 'none';
        }
    });

    $("#statistics-button").click(function() {
        $.ajax({
            url: 'https://raw.githubusercontent.com/zenilharia26/Cov-IP/main/covid_data.xml?token=AH5IY7BQSD2CYNTWULEU2GLAFEKEO',
            method: 'GET',
            success: function(response) {
                parseXml(response);
            }                                    
        })
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

function toggleToNews() {
    document.getElementById('statistics').style.display = 'none';
    document.getElementById('news').style.display = 'block';
}

function toggleToStatistics() {
    document.getElementById('news').style.display = 'none';
    document.getElementById('statistics').style.display = 'block';
}

function parseXml(xml) {
    let parser = new DOMParser();
    let xmlDocument = parser.parseFromString(xml, "text/xml");
    let data = xmlDocument.getElementsByTagName("data");
    let listData = [];

    for(let i = 0;i < data.length;i++) {
        // console.log(data[i].children);
        let row = {};
        for(let j = 0;j < data[i].children.length;j++) {
            row[data[i].children[j].localName] = data[i].children[j].textContent;
        }
        listData.push(row);
    }

    console.log(listData);
}