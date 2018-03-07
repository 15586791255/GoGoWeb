function bindedbackbtn() {
    $(".back-btn").click(function(){
        javascript:history.back(-1);
    });
}

$(function() {
    sendRquest();
});

function sendRquest() {
    $.ajax({
        url: basePath + "api/core/coin/plans",
        dataType: 'JSON',
        timeout: 5000,
        type: "GET",
        beforeSend: function(xhr){
            sendHeaderMin(xhr);
        },
        success: function(data){
            if (data.code == 200) {
                var coin = data.data;
                initrecharge(coin);
                initcoin(coin);
                bindedbackbtn();
                selectamount();
            } else {
                Toast("参数异常", 1000);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            Toast("连接超时", 1000);
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
}

function initrecharge(_coin) {
    var userInfo = getSessionStorage("userInfo");
    var html = document.getElementById("home").innerHTML;
    var recharge = document.getElementById("recharge").innerHTML;;
    if (userInfo == undefined || userInfo == null || userInfo == '') {
        var source = html.replace(reg, function (node, key) { return { 
            'username': '点击登录',
            'coin': '',
            'carcount': '0',
            'avatar': testUrl + 'images/user/def.png'
          }[key]; });
        var nologin = document.getElementById("nologin").innerHTML;
        $("#Home").append(source);
        $(".user-info").append(nologin);
        sourcerecharge = recharge.replace(reg, function (node, key) { return { 
            'coin': '0',
            'payment': _coin[0].fee / 100,
            'coin_plan_id': _coin[0].coin_plan_id
          }[key]; });
    } else {
        initlogined(userInfo);
        sourcerecharge = recharge.replace(reg, function (node, key) { return { 
            'coin': userInfo.coin,
            'payment': _coin[0].fee / 100,
            'coin_plan_id': _coin[0].coin_plan_id
          }[key]; });

    }
    $("#Home").append(sourcerecharge);
}

function initcoin(_data) {
    var html = "<div>";
    if (_data != null && _data != undefined && _data.length > 0) {
        for (index in _data) {
            html += "<div class='recharge-list'>";
            html += "<div class='gold'>";
            html += "<div class='icon'></div>x";
            html += _data[index].coin_count;
            html += " <span class='send'></span>";
            html += "</div>";
            if (index == 0) {
                html += "<div class='btn btn-select'>";
            } else {
                html += "<div class='btn'>";
            }
            html += "<input value='" + _data[index].coin_plan_id + "' type='hidden'></input>";
            html += _data[index].fee / 100;
            html += "元</div>";
            html += "</div>";
        }
    }
    html += "</div>";
    $("div.recharge").find(".myMoney").after(html);
}

function selectamount() {
    $("div.recharge-list").find(".btn").click(function(){
        $("div.btn").each(function() {
            $(this).removeClass("btn-select");
        })
        $(this).addClass("btn-select");
        var amoutnstr = $(this).text();
        var amount = amoutnstr.substring(0, amoutnstr.length - 1);
        var coin_plan_id = $(this).find("input[type=hidden]").val();
        initamount(amount, coin_plan_id);
    });
}

function initamount(_amount, _coin_plan_id) {
    var pay = "\
        需支付\
        <span>￥" + _amount + "元</span>\
        <a href='" + testUrl + "pay.html?coin_plan_id=" + _coin_plan_id + "&pay=" + _amount + "'>\
            <div class='btn'>立即支付</div>\
        </a>\
    ";
    $(".pay").empty();
    $(".pay").append(pay);
}

function bindedLoginShow() {
    $(".login-page").addClass("login-page-show");
    $(".login-page").css("transform", "translateX(0)");
    $("#mask").addClass("huiIN-show");
}

function bindLoginHide() {
    $(".login-page").removeClass("login-page-show");
    $(".login-page").css("transform", "translateX(-100%)");
    $("#mask").removeClass("huiIN-show");
}