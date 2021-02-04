const countryToCode = {
    'Global': '', 'Argentina': 'ar', 'Australia': 'au', 'Austria': 'at', 'Belgium': 'be', 'Brazil': 'br', 'Bulgaria': 'bg', 'Canada': 'ca', 'China': 'cn', 'Colombia': 'co', 'Cuba': 'cu', 'Czech Republic': 'cz', 'Egypt': 'eg', 'France': 'fr', 'Germany': 'de', 'Greece': 'gr', 'Hong Kong': 'hk', 'Hungary': 'hu', 'India': 'in', 'Indonesia': 'id', 'Ireland': 'ie', 'Israel': 'il', 'Italy': 'it', 'Japan': 'jp', 'Latvia': 'lv', 'Lithuania': 'lt', 'Malaysia': 'my', 'Mexico': 'mx', 'Morocco': 'ma', 'Netherlands': 'nl', 'New Zealand': 'nz', 'Nigeria': 'ng', 'Norway': 'no', 'Philippines': 'ph', 'Poland': 'pl', 'Portugal': 'pt', 'Romania': 'ro', 'Russia': 'ru', 'Saudi Arabia': 'sa', 'Serbia': 'rs', 'Singapore': 'sg', 'Slovakia': 'sk', 'Slovenia': 'si', 'South Africa': 'za', 'South Korea': 'kr', 'Sweden': 'se', 'Switzerland': 'ch', 'Taiwan': 'tw', 'Thailand': 'th', 'Turkey': 'tr', 'UAE': 'ae', 'Ukraine': 'ua', 'United Kingdom': 'gb', 'United States': 'us', 'Venuzuela': 've'
}

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

    $("button").click(function() {
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
});

function loadNews(news) {
    console.log(news['articles']);
    newsList = document.getElementsByTagName("ul")[0];
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
            document.getElementById("news-date").innerText = article['publishedAt'];
            document.getElementById("news-description").innerText = article['description'];
            document.getElementById("news-url").innerHTML = "Read More";
            document.getElementById("news-url").href = article['url'];
            document.getElementById("news-url").target = "_blank";
        });
    }

    // console.log(news['articles'].length);
}