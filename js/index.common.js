var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
var basePath = $("base").attr("href");
var channelLoadLink = {
    "iOS": "https://gogo.scrats.cn/gogo/app.html",
    "Android": "https://gogo.scrats.cn/gogo/app.html",
    "Windows Phone": "https://gogo.scrats.cn/gogo/app.html"
};

var testUrl = "";

var countdown = 60;

var sessionStorageJsonKey = [
    "haderInfo",
    "userInfo",
    "bottomLinkType",
    "raceId"
]

function sendHeaderMin(obj) {
    obj.setRequestHeader('pt', 'web');
    obj.setRequestHeader('app_key', 'test_key');
}

function sendHeader(obj, data) {
    if (data == null) {
        return false;
    }
    obj.setRequestHeader('pt', 'web');
    obj.setRequestHeader('app_key', 'test_key');
    obj.setRequestHeader('access_token', data.access_token);
    obj.setRequestHeader('uid', data.uid);
}

function setSessionStorage(str, data) {
    window.sessionStorage.setItem(str, JSON.stringify(data));
}

function removeSession(str) {
    window.sessionStorage.removeItem(str);
}

function getSessionStorage(str) {
    var ret = JSON.parse(window.sessionStorage.getItem(str));
    if (ret == null) {
        return false;
    } else {
        return ret;
    }
    
}

function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    var count = msg.length;
    m.style.cssText = "opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 50%;z-index: 999999;margin:auto -" + count / 2 + "em; background: rgb(0, 0, 0);padding: 0 10px 0 10px";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

function myToast(msg, duration, bgcolor, fontSize) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    var count = msg.length;
    m.style.cssText = "opacity: 0.7;height: 1rem;color: rgb(255, 255, 255);line-height: 1rem;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 50%;z-index: 999999;margin:auto -" + count / 2 + "em; background: " + bgcolor + ";font-size: " + fontSize + ";padding: 0 10px 0 10px";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

var is_weixin = (function(){return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1})();
if(is_weixin){
    $(function(){
        return true;
    });
}else{
    $(function(){
        return false;
    });
}

// buttom event
function downLoadApp() {
    var sysType = window.sessionStorage.getItem("channel");
    if(channelLoadLink.hasOwnProperty(sysType)){
        var t = this.channelLoadLink[sysType];
        window.location.href = t
    } else window.location.href = "http://www.bilibili.com"
}

function checkInput(obj, msg) {
    var ret = obj.val();
    ret = ret.replace(/\,/g, "");
    if(ret == "") {
        myToast(msg, 1000, "#F43B47", "0.5rem");
    }
    return ret;
}

function settime(obj, style) {
    if (countdown == 0) {
        obj.removeClass(style); 
        obj.text("获取验证码");
        countdown = 60; 
        return;
    } else { 
        obj.addClass(style);
        obj.text("重新获取(" + countdown + "S)");
        countdown--; 
    } 
    setTimeout(function() { 
        settime(obj, style)
    }, 1000)
}

function getCode() {
    if (countdown != 60) {
        return;
    }
    var inputNumber = checkInput($('#phone-input'), "请输入正确的手机号");
    if (inputNumber != undefined && inputNumber != "") {
        $.ajax({
            url: "api/account/sms",
            dataType: 'JSON',
            timeout: 50000,
            type: "POST",
            async: false,
            data: {
                "tel":inputNumber
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader('pt', 'web');
                xhr.setRequestHeader('app_key', 'test_key');
            },
            success: function(data){
                if (data.code == 200) {
                    settime($(".get-code"), "get-code-ing");
                } else if (data.code == 500) {
                   myToast(data.msg, 1000, "#F43B47", "0.5rem");
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }
}

function refreshUserInfo() {
    var loginInfo = getSessionStorage(sessionStorageJsonKey[0]);
    if (loginInfo != null) {
        $.ajax({
            url: "api/account/token",
            dataType: 'JSON',
            timeout: 50000,
            type: "POST",
            data: {
                "refresh_token": loginInfo.refresh_token
            },
            beforeSend: function(xhr){
                sendHeader(xhr, loginInfo);
            },
            success: function(data){
                if (data.code == 200) {
                    setSessionStorage(sessionStorageJsonKey[0], data.data);
                    getUserInfo();
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                Toast("连接超时", 1000);
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }
}

function getUserInfo() {
    console.log(getSessionStorage(sessionStorageJsonKey[0]));
    $.ajax({
        url: "api/core/user",
        dataType: 'JSON',
        timeout: 50000,
        type: "GET",
        beforeSend: function(xhr){
            sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
        },
        success: function(data){
            if (data.code == 200) {
                setSessionStorage(sessionStorageJsonKey[1], data.data);
            } else {
                Toast("连接超时", 1000);
            }
            console.log(data.data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
}

$(function() {
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){  
        window.sessionStorage.setItem("channel", "iOS");
    } else if(/(Windows Phone|windows|Windows)/i.test(navigator.userAgent)){  
        window.sessionStorage.setItem("channel", "Windows Phone");
    } else {
        window.sessionStorage.setItem("channel", "Android");
    }
    refreshUserInfo();
});
