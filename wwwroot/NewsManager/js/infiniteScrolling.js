const newsContainer = document.getElementById("newsContainer");
const newsCountElem = document.getElementById("newsCount");
const newsTotalElem = document.getElementById("newsTotal");
const loader = document.getElementById("loader");
const newsLimit = 99;
const newsIncrease = 5;
const pageCount = Math.ceil(newsLimit / newsIncrease);

var throttleTimer;
let currentPage = 1;            
newsTotalElem.innerHTML = newsLimit;
function createNews(index) {
    const news = document.createElement("div");
    news.className = "card";
    news.innerHTML = index;
    newsContainer.appendChild(news);
};

function addNews(pageIndex) {
    currentPage = pageIndex;

    const startRange = (pageIndex - 1) * newsIncrease;
    const endRange =
        currentPage == pageCount ?newsLimit : pageIndex * newsIncrease;

    newsCountElem.innerHTML = endRange;

    for (let i = startRange + 1; i <= endRange; i++) {
        createNews(i);
    }
};

function handleInfiniteScroll(){
    throttle(() => {
        const endOfPage =
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

        if (endOfPage) {
        addCards(currentPage + 1);
        }

        if (currentPage === pageCount) {
            removeInfiniteScroll();
        }
    }, 1000);
};
function removeInfiniteScroll(){
    loader.remove();
    window.removeEventListener("scroll", handleInfiniteScroll);
};

function throttle(callback, time){
    if (throttleTimer) return;

    throttleTimer = true;

    setTimeout(() => {
        callback();
        throttleTimer = false;
    }, time);
};

window.onload = function () {
    addNews(currentPage);
};

window.addEventListener("scroll", handleInfiniteScroll);