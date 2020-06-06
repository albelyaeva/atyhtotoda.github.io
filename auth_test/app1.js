(function () {
    if(location.hash.indexOf("#access_token=")===0){
        localStorage.token = location.hash.substring(14,99);
        localStorage.session = Date.now() + 86400;
        location.hash = "";
    }
    if(Date.now() <= parseInt(localStorage.session)) {
        $("#btn").hide();
        const token = localStorage.token;
        var req=`https://api.vk.com/method/users.get?access_token=${token}`;
        $.ajax({
            url : req,
            type : "GET",
            dataType : "jsonp",
            success : render
        });
    }
        function render(response) {
            let html = '';
            for (let i = 1; i < response.length; i++) {
                let f = response[i];
                html += "<div class=\"card col-sm\">" +
                    "<img class=\"card-img-top\" src=\"" + f.photo_200 + "\">" +
                    "<div class=\"card-body\">" +
                    "<h5 class=\"card-text\">" + f.first_name + ' ' + f.last_name + "</h5>" +
                    "</div>" +
                    "</div>";
            }
        }
})();