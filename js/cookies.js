checkCookie()
console.log('scwoiad') 
$('#dsgvo_accept').click(function (e) {
    $('.dsgvo').fadeOut();
    setCookie('om90-cookies', 'accepted', 29);
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var value = getCookie("om90-cookies");
    if (value == "accepted") {
        $('.dsgvo').hide();
    } else {
        $('.dsgvo').show();
    }
}