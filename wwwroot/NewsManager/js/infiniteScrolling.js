const Host = "http://localhost:5000";
const API = "/api/news";
const periodicRefreshPeriod = 5;
const dataLimit = 4;
let currentDataNumber = 0;
let currentETag = "";
let currentOffset = 0;
let currentPage = 0;
let retreivingData = false;
webAPI_GET_ALL(fillDataList,"?sort=Date,desc&offset=" + currentOffset + "&limit=" + dataLimit);

setInterval(() => {
    webAPI_HEAD(checkETag);
}, periodicRefreshPeriod * 1000);

window.onscroll = function() {
    let totalPageHeight = document.body.scrollHeight; 
    let scrollPoint = window.scrollY + window.innerHeight;
    if(scrollPoint >= totalPageHeight)
    {
        if(!retreivingData){
            retreivingData = true;
            currentOffset++;
            webAPI_GET_ALL(fillDataList,"?sort=Date,desc&offset=" + currentOffset + "&limit=" + dataLimit);
        }
        else{
            console.log("Already retreiving data");
        }
    }
}

function checkETag(ETag) {
    if (ETag != currentETag) {
        currentETag = ETag;
        webAPI_GET_ALL(refreshData,"?sort=Date,desc&limit=" + currentDataNumber);
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
            if (errorCallBack !== undefined)
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

function setEditDeleteHandler () {
    $("#deleteAlertModal").on("show.bs.modal", event => {
        console.debug(event);
        let button = event.relatedTarget;

        let id = $(button).attr('data-bs-targetId');
        let title = $(button).attr('data-bs-targetTitle');

        $("#deleteAlert_Title").html(title);
        $("#deleteAlert_Id").val(id);
        
    });
};

function removeUndefinedImages () {
    $("img").on("error", event => {
        $(event.target).remove();
    });
};

function insertDataRow(dataRow){
    $(".newsList").append(New(dataRow));
    removeUndefinedImages();
}

const New = (data) => `
<div class="col">
    <div class="card border-dark">
        <img class="card-img-top" src="${ data.Url}">
        <div class="card-body">
            <h5 class="card-title">${data.Title}</h5>
            <p class="card-text">${ data.Texte.length >= 500 ? data.Texte.substring(0, 500) + " ..." : data.Texte }</p>
            <div style="float: right;" class="btn-group" role="group" aria-label="Card interaction">
                <button name="editNouvelle" id="edit_${data.Id}"  
                    type="button" 
                    class="btn btn-warning" 
                    tooltip="Modifier la nouvelle" 
                    tooltip-position="left">
                    <i style="font-size: 1.5rem; color: white;" class="bi bi-pencil-square"></i>
                </button>
                <button name="deleteNouvelle" 
                    data-bs-toggle="modal" 
                    data-bs-target="#deleteAlertModal" 
                    data-bs-targetId="${data.Id}"
                    data-bs-targetTitle="${data.Titre == undefined ? data.Title : data.Titre}"
                    id="delete_${data.Id}" 
                    type="button" 
                    class="btn btn-danger" 
                    tooltip="Supprimer la nouvelle" 
                    tooltip-position="right">
                    <i style="font-size: 1.5rem; color: white;" class="bi bi-journal-minus"></i>
                </button>
            </div>
        </div>
        <div class="card-footer">
            <small>${ new Date(parseInt(data.Date)).toISOString().split("T")[0] }</small>
        </div>
    </div>
</div>`;


function fillDataList(dataList, ETag) {
    currentETag = ETag;

    if(dataList.length != 0){
        for (let data of dataList) {
            insertDataRow(data);
            currentDataNumber++;
        }
        retreivingData = false;
        console.log(currentDataNumber);
    }
    else{
        console.log("No more data to load");
    }
}

setEditDeleteHandler();
function refreshData(dataList, ETag){
    currentETag = ETag;
    $(".newsList").empty();
    if(dataList.lenght != 0){
        for (let data of dataList) {
            insertDataRow(data);
        }
        console.log("Data changed when" + currentDataNumber + "data was loaded");
    }
}






