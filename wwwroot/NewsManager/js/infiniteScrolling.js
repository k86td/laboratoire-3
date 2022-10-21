const Host =  "http://localhost:5000"; //window.location.hostname;
const API = "/api/news";
const periodicRefreshPeriod = 5;
const dataLimit = 6;
let currentDataNumber = 0;
let currentETag = "";
let currentOffset = 0;
let currentPage = 0;
let retreivingData = false;
const scroll = document.getElementsByClassName("scrollContainer");

scroll[0].addEventListener("scroll", handleScroll);
webAPI_GET_ALL(fillDataList, "?sort=Date,desc&offset=" + currentOffset + "&limit=" + dataLimit);
setInterval(() => {
    webAPI_HEAD(checkETag);
}, periodicRefreshPeriod * 1000);


function checkETag(ETag) {
    if (ETag != currentETag) {
        currentETag = ETag;
        webAPI_GET_ALL(refreshData, "?sort=Date,desc&limit=" + currentDataNumber + "&page=" + ++currentPage);
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

function setEditDeleteHandler() {
    $("#deleteAlertModal").on("show.bs.modal", event => {
        let button = event.relatedTarget;

        let id = $(button).attr('data-bs-targetId');
        let title = $(button).attr('data-bs-targetTitle');

        $("#deleteAlert_Title").html(title);
        $("#deleteAlert_Id").val(id);
    });

    $("#editNouvelleModal").on("show.bs.modal", event => {

        let button = event.relatedTarget;

        let id = $(button).attr('data-bs-targetId');
        let title = $(button).attr('data-bs-targetTitle');
        let url = removeProtFromUrl($(button).attr('data-bs-targetUrl'));
        let category = $(button).attr('data-bs-targetCategory');
        let texte = $(button).attr('data-bs-targetTexte')
        let date = $(button).attr('data-bs-targetDate');

        $("#editNouvelle_Id").val(id);
        $("#editNouvelle_Title").val(title);
        $("#editNouvelle_Url").val(url);
        $("#editNouvelle_Category").val(category);
        $("#editNouvelle_Date").html(date);
        $("#editNouvelle_Texte").val(texte);
        
    });
};

function removeUndefinedImages() {
    $("img").on("error", event => {
        $(event.target).remove();
    });
};

function insertDataRow(dataRow) {
    $(".scrollContainer").append(New(dataRow));
    removeUndefinedImages();
}

const New = (data) => {
    console.debug(data);
    return `
<div class="col">
    <div class="card border-dark">
        <img class="card-img-top" src="${data.Url}">
        <div class="card-body">
            <h5 class="card-title">${data.Title}</h5>
            <p class="card-text">${data.Texte.length >= 500 ? data.Texte.substring(0, 500) + " ..." : data.Texte}</p>
            <div style="float: right;" class="btn-group" role="group" aria-label="Card interaction">
                <button name="editNouvelle" id="edit_${data.Id}"  
                    type="button" 
                    class="btn btn-warning" 
                    tooltip="Modifier la nouvelle" 
                    tooltip-position="left"
                    data-bs-toggle="modal"
                    data-bs-target="#editNouvelleModal"
                    data-bs-targetId="${data.Id}"
                    data-bs-targetUrl="${data.Url}"
                    data-bs-targetTitle="${data.Title}"
                    data-bs-targetTexte="${data.Texte}"
                    data-bs-targetDate="${data.Date}"
                    data-bs-targetCategory="${data.Category}"
                >
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
                    tooltip-position="left">
                    <i style="font-size: 1.5rem; color: white;" class="bi bi-journal-minus"></i>
                </button>
            </div>
        </div>
        <div class="card-footer">
            <small>${new Date(parseInt(data.Date)).toISOString().split("T")[0]}</small>
        </div>
    </div>
</div>`
};


function fillDataList(dataList, ETag) {
    currentETag = ETag;
    if (dataList.length != 0) {
        for (let data of dataList) {
            insertDataRow(data);
            currentDataNumber++;
        }
        retreivingData = false;
    }
    else {
        console.log("No more data to load");
    }
}

setEditDeleteHandler();
function refreshData(dataList, ETag) {
    currentETag = ETag;
    $(".scrollContainer").empty();
    if (dataList.lenght != 0) {
        for (let data of dataList) {
            insertDataRow(data);
        }
    }
}

function handleScroll() {
    const scrollDiv = document.getElementsByClassName('scrollContainer')[0];
    let lastScrollTop = 0;
    scrollDiv.onscroll = (e) => {
        if (scrollDiv.scrollTop < lastScrollTop) {
            // upscroll  
            return;
        }
        else if (scrollDiv.scrollTop == lastScrollTop) {
            // no scroll
            return;
        }
        lastScrollTop = scrollDiv.scrollTop <= 0 ? 0 : scrollDiv.scrollTop;
        if (scrollDiv.scrollTop + scrollDiv.offsetHeight >= scrollDiv.scrollHeight) {
            if (!retreivingData) {
                retreivingData = true;
                currentOffset++;
                webAPI_GET_ALL(fillDataList, "?sort=Date,desc&limit=" + dataLimit + "&offset=" + currentOffset);
            }
            else {
                console.log("Already retreiving data");
            }
        }
    }
}
