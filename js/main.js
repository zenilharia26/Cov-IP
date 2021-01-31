const countryToCode = {
    'Global': '', 'Argentina': 'ar', 'Australia': 'au', 'Austria': 'at', 'Belgium': 'be', 'Brazil': 'br', 'Bulgaria': 'bg', 'Canada': 'ca', 'China': 'cn', 'Colombia': 'co', 'Cuba': 'cu', 'Czech Republic': 'cz', 'Egypt': 'eg', 'France': 'fr', 'Germany': 'de', 'Greece': 'gr', 'Hong Kong': 'hk', 'Hungary': 'hu', 'India': 'in', 'Indonesia': 'id', 'Ireland': 'ie', 'Israel': 'il', 'Italy': 'it', 'Japan': 'jp', 'Latvia': 'lv', 'Lithuania': 'lt', 'Malaysia': 'my', 'Mexico': 'mx', 'Morocco': 'ma', 'Netherlands': 'nl', 'New Zealand': 'nz', 'Nigeria': 'ng', 'Norway': 'no', 'Philippines': 'ph', 'Poland': 'pl', 'Portugal': 'pt', 'Romania': 'ro', 'Russia': 'ru', 'Saudi Arabia': 'sa', 'Serbia': 'rs', 'Singapore': 'sg', 'Slovakia': 'sk', 'Slovenia': 'si', 'South Africa': 'za', 'South Korea': 'kr', 'Sweden': 'se', 'Switzerland': 'ch', 'Taiwan': 'tw', 'Thailand': 'th', 'Turkey': 'tr', 'UAE': 'ae', 'Ukraine': 'ua', 'United Kingdom': 'gb', 'United States': 'us', 'Venuzuela': 've'
}

$( document ).ready(function() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const apiEndpoint = `${proxy}https://newsapi.org/v2/top-headlines?q=corona`;
    const apiKey = '148162a1b18c4fb092bbf0fe2a2d2885';
    let countryDropdown = document.getElementById('country');

    for(let country in countryToCode) {
        let option = document.createElement('option');
        option.innerText = country;
        countryDropdown.appendChild(option);
    }

    $("button").click(function() {
        const countryId = countryToCode[document.getElementById('country').value];
        console.log(countryId);
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
    // console.log(news['articles']);
    newsList = document.getElementsByTagName("ul")[0];
    newsList.innerHTML = "";

    for(let article of news['articles']) {
        var listItem = document.createElement('li');
        var heading = document.createElement('h4');
        heading.innerText = article['title'];
        listItem.appendChild(heading);
        listItem.classList.add('list-group-item');
        newsList.appendChild(listItem);
    }
}