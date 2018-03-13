function login() {
    var inputNumber = checkInput($("#phone-input"), "请输入手机号");
    if (inputNumber != undefined && inputNumber != "") {
        var code = checkInput($("#code"), "请输入验证码");
        if (code != undefined && code != "") {
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
                                    window.location.href = $("base").attr("href") + testUrl + "index.html";
                                } else {
                                    myToast("连接超时", 1000, "#F43B47", "0.5rem");
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                console.log('error ' + textStatus + " " + errorThrown);
                            }
                        });
                    } else {
                        myToast("手机验证码错误或者已过期", 1000, "#F43B47", "0.5rem");
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    myToast("连接超时", 1000, "#F43B47", "0.5rem");
                    console.log('error ' + textStatus + " " + errorThrown);
                }
            });
        }
    }
}