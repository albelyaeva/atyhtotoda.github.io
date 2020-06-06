(function () {


if(location.hash.indexOf("#access_token=")===0){
    localStorage.token = location.hash.substring(14,99);
    localStorage.session = Date.now() + 86400;
    location.hash = "";
}

    function send(method, params, callback) {
        $.ajax({
            url: URL(method, params),
            method: "GET",
            dataType: "JSONP",
            success: callback
        });
    }


if(Date.now() <= parseInt(localStorage.session)){
        $("#btn").hide();
    send('friends.search',{count:5, fields:'photo_100'}, function (data) {
        render(data.response);
    });
    send('users.get',{}, function (data) {
        //render
        const btn = '<button type="button" onclick="localStorage.clear(); location.reload();" class="btn btn-dark">Выйти</button>';
        $('#username').html('+data.response[0].first_name+' + '+data.response[0].last_name+' + btn).show();
    });
}

/**
 * @return {string}
 */
function URL  (method, params) {
    if (!method) throw new Error('Method not found');
    params = params || {};
    params['access_token'] = localStorage.token;
    return "https://api.vk.com/method/" + method + '?' + $.param(params);
}

function render(response) {
    let html = '';
    for(let i=1; i<response.length;i++){
        let f = response[i];
        html += "<div class=\"card col-sm\">" +
            "<img class=\"card-img-top\" src=\""+f.photo_100+"\">" +
            "<div class=\"card-body\">" +
            "<h5 class=\"card-text\">"+f.first_name+' '+f.last_name+"</h5>" +
            "</div>" +
            "</div>";
    }
    //console.log(html);
    $("#friends").html(html);
}
})();