var countdown = 60;

function getUserInfo() {
    console.log(getSessionStorage(sessionStorageJsonKey[0]));
    $.ajax({
        url: "api/core/user",
        dataType: 'JSON',
        timeout: 5000,
        type: "GET",
        beforeSend: function(xhr){
            sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
        },
        success: function(data){
            if (data.code == 200) {
                setSessionStorage(sessionStorageJsonKey[1], data.data);
                initlogined(data.data);
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

function login() {
    var inputNumber = checkInput($("#phone-input"), "请输入手机号");
    if (inputNumber != undefined && inputNumber != "") {
        var code = checkInput($("#code"), "请输入验证码");
        if (code != undefined && inputNumber != "") {
            $.ajax({
                url: "api/account/sms_login",
                dataType: 'JSON',
                timeout: 5000,
                type: "POST",
                data: {
                    "tel": inputNumber,
                    "code": code
                },
                beforeSend: function(xhr){
                    sendHeaderMin(xhr);
                },
                success: function(data){
                    if (data.code == 200) {
                        setSessionStorage(sessionStorageJsonKey[0], data.data);
                        $.ajax({
                            url: "api/core/user",
                            dataType: 'JSON',
                            timeout: 5000,
                            type: "GET",
                            beforeSend: function(xhr){
                                sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
                            },
                            success: function(data){
                                if (data.code == 200) {
                                    setSessionStorage(sessionStorageJsonKey[1], data.data);
                                    location.reload();
                                } else {
                                    Toast("连接超时", 1000);
                                }
                                console.log(data.data);
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                console.log('error ' + textStatus + " " + errorThrown);
                            }
                        });
                    } else {
                        Toast("手机验证码错误或者已过期", 1000);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    Toast("连接超时", 1000);
                    console.log('error ' + textStatus + " " + errorThrown);
                }
            });
        }
    }
}

function refreshUserInfo() {
	var loginInfo = getSessionStorage(sessionStorageJsonKey[0]);
	if (loginInfo != null) {
        $.ajax({
            url: "api/account/token",
            dataType: 'JSON',
            timeout: 5000,
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

function initlogined(_data) {
    $("#login-page").remove();
    $(".user-info").remove();
    if (_data.avatar == null || _data.avatar == undefined || _data.avatar == '') {
        _data.avatar = testUrl + 'images/user/def.png';
    }
    var html = document.getElementById("home").innerHTML;
    var source = html.replace(reg, function (node, key) { return { 
        'username': _data.username,
        'coin': _data.coin,
        'carcount': '0',
        'avatar': _data.avatar
      }[key]; });
    var logined = document.getElementById("logined").innerHTML;
    var sourceLogined = logined.replace(reg, function (node, key) { return { 
        'username': _data.username,
        'coin': _data.coin,
        'avatar': _data.avatar
      }[key]; });
    $("#Home").prepend(source);
    $(".user-info").append(sourceLogined);
    $(".setBtn").click(function() {
        $("#am-modal-container").show();
    });
}

function signOut() {
    removeSession(sessionStorageJsonKey[0]);
    removeSession(sessionStorageJsonKey[1]);
    setTimeout(function(){
        window.location.href = $("base").attr("href") + testUrl + "index.html";
    }, 200);
}


function getCode() {
    if (countdown != 60) {
        Toast("请稍候再试", 1000);
        return;
    }
    var inputNumber = checkInput($('#phone-input'), "请输入正确的手机号");
    if (inputNumber != undefined && inputNumber != "") {
        $.ajax({
            url: "api/account/sms",
            dataType: 'JSON',
            timeout: 5000,
            type: "POST",
            data: {
                "tel":inputNumber
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader('pt', 'web');
                xhr.setRequestHeader('app_key', 'test_key');
            },
            success: function(data){
                settime($(".code-btn"), "code-btn-ing");
                if (data.code == 200) {
                    console.log(1);
                } else if (data.code == 500) {
                    console.log(2);
                }
                console.log(data.msg);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }
}