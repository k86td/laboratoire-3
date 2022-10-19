const Host = "http://localhost:5000";
const API = "/api/news";
const periodicRefreshPeriod = 5;
let currentETag = "";
let currentPage = 1;
let retreivingData = false;
webAPI_HEAD(checkETag);
window.onscroll = function() {

    // @var int totalPageHeight
    var totalPageHeight = document.body.scrollHeight; 

    // @var int scrollPoint
    var scrollPoint = window.scrollY + window.innerHeight;

    // check if we hit the bottom of the page
    if(scrollPoint >= totalPageHeight)
    {
        if(!retreivingData){
            retreivingData = true;
            currentPage++;
            webAPI_HEAD(checkETag);
            console.log("current page : " + currentPage);
        }
        else{
            console.log("Already retreiving data");
        }
    }
}

function checkETag(ETag) {
    if (ETag != currentETag) {
        currentETag = ETag;
        webAPI_GET_ALL(fillDataList, "?page=" + currentPage);
    }
}
function webAPI_GET_ALL(successCallBack, queryString = null) {
    $.ajax({
        url: Host + API + queryString,
        type: 'GET',
        contentType: 'text/plain',
        data: {},
        success: (data, status, xhr) => {
            let ETag = xhr.getResponseHeader("ETag");
            successCallBack(data, ETag);
            console.log("webAPI_GET_ALL - success", data);
            console.log(`ETag: ${ETag}`);
        },
        error: function (jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_HEAD - error", jqXHR.status);
        }
    });
}
function webAPI_HEAD(successCallBack) {
    $.ajax({
        url: Host + API,
        type: 'HEAD',
        contentType: 'text/plain',
        complete: function (request) {
            console.log(request.getResponseHeader('ETag'));
            successCallBack(request.getResponseHeader('ETag'));
        },
        error: function (jqXHR) {
            console.log("webAPI_HEAD - error", jqXHR.status);
        }
    });
}

function insertDataRow(dataRow){

    console.debug(dataRow);
    $(".newsList").append(New(dataRow));
}

const New = (data) => `
<div class="col">
    <div class="card border-dark">
        <img src="${ data.ImageUrl == undefined ? data.Url : data.ImageUrl}">
        <div class="card-body">
            <h5 class="card-title">${data.Titre}</h5>
            <p class="card-text">${ data.Texte.length >= 750 ? data.Texte.substring(0, 500) + "..." : data.Texte }</p>
        </div>
        <div class="card-footer">
            <small>${ new Date(parseInt(data.Date)).toISOString().split("T")[0] }</small>
        </div>
    </div>
</div>
`;


function fillDataList(dataList, ETag) {
    
    if(dataList.lenght != 0){
        currentETag = ETag;
        for (let data of dataList) {
            insertDataRow(data);
        }
        retreivingData = false;
    }
    else{
        console.log("No more data to load");
    }
}

// function handleScroll(){
//     let lastScrollTop = 0;
//     window.onscroll = (e)=>{
//         if (window.scrollTop < lastScrollTop){
//             // upscroll 
//             return;
//         }
//         else if(window.scrollTop == lastScrollTop){
//             // no scroll
//             return;
//         }
//         lastScrollTop = scrollDiv.scrollTop <= 0 ? 0 : scrollDiv.scrollTop;
//         if (window.scrollTop + window.offsetHeight >= window.scrollHeight ){
//             if(!retreivingData){
//                 retreivingData = true;
//                 currentPage++;
//                 webAPI_HEAD(checkETag);
//                 console.log("current page : " + currentPage);
//             }
//             else{
//                 console.log("Already retreiving data");
//             }
//         }
//     }
// }





