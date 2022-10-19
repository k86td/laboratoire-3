const inputSslUrlHandler = (selector) => {
    $(selector).on('click', event => {
        // toggle http/https protocol on click
        let nextProt;
        
        switch (event.target.innerHTML) {
            case 'https://': 
                nextProt = 'http://';
                break;
            case 'http://':
                nextProt = "https://";
                break;
            default:
                nextProt = 'http://';
                break;
        }

        event.target.innerHTML = nextProt;
    });

};
const setDateInputDefaultDate = (selector) => {
    $(selector).attr("value", new Date(Date.now()).toISOString().split("T")[0]);
};
const resetForm = (selector) => {
    $(selector + " input").val("");
};
const gatherFormDataToJson = (selector) => {
    const appendToDict = (dict, key, value) => {
        if (dict[key] === undefined)
            dict[key] = value;
        else
            dict[key] += value;

        return dict;
    };

    let inputs = $(selector + " input,span,textarea");

    let ids = [];
    inputs.each((_, el) => {
        ids.push(el.id);
    })

    let data = {
        "Id": 0
    };

    ids.forEach(id => {
        if (id == undefined || id == '')
            return;

        let key = id.split("_")[1];

        let value = $("#" + id).val()

        if (key.includes("pre")) {
            key = key.replace("pre", "");
            data = appendToDict(data, key, $("#" + id).html());
        }
        else if (key.toLowerCase().includes("date")) {
            data = appendToDict(data, key, new Date($("#" + id).val()).getTime())
        }
        else {
            data = appendToDict(data, key, value);
        }
    });

    return data;
};
const uPostJsonCallback = async (url, body, callbacks) => {
    let content = $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(body),
        dataType: "json",
        contentType: "application/json",
        success: callbacks.success,
        error: callbacks.error
    });

    if (callbacks.loading !== undefined)
        callbacks.loading();
    
    content = await content;
};

const createNouvelleHandler = () => {
    inputSslUrlHandler("#createNouvelle_preImageUrl");
    setDateInputDefaultDate("#createNouvelle_Date");

    $("#createNouvelle").on("submit", event => {
        event.preventDefault()
        event.stopPropagation()

        // gather form data
        let json = gatherFormDataToJson("#createNouvelle");
        console.debug(json);
        // send post request
        uPostJsonCallback("http://localhost:5000/api/News", json, {
            loading: _ => {
                // set rolling icon
                $("#createNouvelle_submit").prop('disabled', true);
                $("#createNouvelle_submit").html('<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>');
            },
            error: _ => {
                $("#createNouvelle_submit").prop('disabled', false);
                $("#createNouvelle_submit").removeClass("btn-primary");
                $("#createNouvelle_submit").addClass("btn-danger");
                $("#createNouvelle_submit").html("Impossible de créer la nouvelle");
            },
            success: _ => {
                $('#createNouvelleModal').modal('hide');
            }
        });
    });
};



createNouvelleHandler();