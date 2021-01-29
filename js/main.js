$( document ).ready(function() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const apiEndpoint = `${proxy}https://newsapi.org/v2/top-headlines?q=corona`;
    const apiKey = '148162a1b18c4fb092bbf0fe2a2d2885';

    $("button").click(function() {
        const url = apiEndpoint + '&apiKey=' + apiKey;
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