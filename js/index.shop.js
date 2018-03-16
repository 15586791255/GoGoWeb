function bindedbackbtn() {
    $(".back-btn").click(function(){
        javascript:history.back(-1);
    });
}

$(function() {
    inithome();
    bindedbackbtn();
    initNavList();
    initNav();
    $("#hot").addClass("nav-btn-select");
    initNavList("hot");
});

function inithome() {
    var shop = document.getElementById("shop").innerHTML;

    $("#Home").append(shop);
    var height = $(window).height() - $(".user-info").outerHeight(true) - $("#title").outerHeight(true) - $(".ShopList").outerHeight(true);
    height = height + "px";
    $(".HomeList").css("height", height);
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

function initNav() {
    $("div.nav-btn").click(function(){
        $("div.nav-btn").each(function () {
            if ($(this).hasClass("nav-btn-select")) {
                $(this).removeClass("nav-btn-select");
            }
        });
        $(this).addClass("nav-btn-select");
        initNavList($(this).attr("id"));
    });
}

function initNavList(_id) {
    $(".HomeList").html("");
    $.ajax({
        type: 'GET',
        url: "api/mall/goods/",
        timeout: 5000,
        dataType: 'JSON',
        data: {
            'tp': _id
        },
        beforeSend: function(xhr){
            xhr.setRequestHeader('pt', 'web');
            xhr.setRequestHeader('app_key', 'test_key');
        },
        success: function(data) {
            if (data.code == 200) {
                var data = data.data;
                var html = '';
                var arrlen = data.items.length;
                if (arrlen > 0) {
                    for (var index in data.items) {
                        html += '<div class="list">';
                        html += '<div class="border">';
                        html += '<div class="img-box">';
                        html += '<div class="img" style="background: url(&quot;' + data.items[index].cover + '&quot;) center center / cover no-repeat rgb(255, 255, 255);">';
                        html += '<div class="huiIN">';
                        html += '<div class="name">' + data.items[index].title + '</div>';
                        html += '<div class="money">' + data.items[index].coin + '<span>竞猜币</span>';
                        html += '</div>';
                        html += '<div class="count">剩余' + data.items[index].total + '<span>件</span></div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    }
                    $(".HomeList").html(html);
                    setTimeout(function(){
                        initBindButton();
                    }, 200);
                } else {
                    Toast("暂时没有此类商品", 1000);
                }
            } else if (data.code == 500) {

            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
}

function initBindButton() {
    $(".list").unbind().click(function() {
         $("#am-modal-container").show();
    });
}