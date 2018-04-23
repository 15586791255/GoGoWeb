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
        timeout: 50000,
        async: false,
        type: "GET",
        beforeSend: function(xhr){
            sendHeaderMin(xhr);
        },
        success: function(data){
            if (data.code == 200) {
                var coin = data.data;
                initrecharge(coin);
                var height = $(window).height() - $("#title").outerHeight(true);
                height = height + "px";
                $(".HomeList").css("height", height);
                var html = '';
                var arrlen = coin.length;
                if (arrlen > 0) {
                    for (var index in coin) {
                        html += '<div class="list">';
                        html += '<div class="border">';
                        html += '<div class="img-box">';
                        html += "<input value='" + coin[index].coin_plan_id + "' type='hidden'></input>";
                        html += '<div class="img" style="background: url(&quot;' + coin[index].gift_icon + '&quot;) center center / cover no-repeat #495AFF;">';
                        html += '<div class="huiIN">';
                        html += '<div class="left">';
                        html += '<div class="name">' + coin[index].gift_name + 'x' + coin[index].gift_count + '</div>';
                        html += '<div class="money">' + coin[index].coin_count + '<span>竞猜币</span></div>';
                        html += '</div>';
                        html += '<div class="right">';
                        if (index > 0) {
                            html += '<div class="btn">￥' + coin[index].fee / 100 + '</div>';
                        } else {
                            html += '<div class="btn btn-select">￥' + coin[index].fee / 100 + '</div>';
                        }
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    }
                    $(".HomeList").html(html);
                    selectamount();
                } 
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


function selectamount() {
    $("div.HomeList").find(".img-box").click(function(){
        $("div.btn").each(function() {
            $(this).removeClass("btn-select");
        })
        var select = $(this).find(".btn");
        select.addClass("btn-select");
        var amoutnstr = select.text();
        var amount = amoutnstr.substring(1, amoutnstr.length);
        var coin_plan_id = $(this).find("input[type=hidden]").val();
        initamount(amount, coin_plan_id);
    });
}

function initrecharge(_coin) {
    var recharge = document.getElementById("recharge").innerHTML;;
    sourcerecharge = recharge.replace(reg, function (node, key) { return { 
        'payment': _coin[0].fee / 100,
        'coin_plan_id': _coin[0].coin_plan_id
      }[key]; });
    $("#Home").append(sourcerecharge);
    bindedbackbtn();
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