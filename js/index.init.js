// 本地测试代码
function setSession() {
   var userInfo = {avatar: "http://wx.qlogo.cn/mmopen/b7bn98x8qbf1qHuFMK3sYtfWWTDAQqia62icqQLobW5bfcM07lDQfkWjX4c5smosib4HGwMLJ6ic22okUMTkoj7FwXyNeWHXpQam/0",coin: 1000, gender: "unknown", tel: "15586791255", uid: "03381145", username: "15586791255"}
   setSessionStorage(sessionStorageJsonKey[1], userInfo);
}

var zzl = "name:[name]";
var isScroll = false;
var firstInit = false;

$(function() {
    inithome();
    initmarquee();
    initHomeNav();
    //initHotRaces();
    initHomeList();
    /*initBottom();*/
    initFoot();
    showDetailList();
});

function initHotRaces() {
    $.ajax({
        url: "api/core/races/hot",
        dataType: 'JSON',
        timeout: 5000,
        type: "GET",
        beforeSend: function(xhr){
            sendHeaderMin(xhr);
        },
        success: function(data){
            if (data.code == 200) {
                var data = data.data;
            } else {
                Toast("参数错误", 1000);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            Toast("连接超时", 1000);
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
}

function inithome() {
    var data = getSessionStorage("userInfo");
    if (data == undefined || data == null || data == '') {
        var html = document.getElementById("home").innerHTML;
        var source = html.replace(reg, function (node, key) { return { 
            'username': '点击登录',
            'coin': '',
            'carcount': '0',
            'avatar': testUrl + 'images/user/def.png'
          }[key]; });
        var nologin = document.getElementById("nologin").innerHTML;
        $("#Home").append(source);
        $(".user-info").append(nologin);
    } else {
        initlogined(data);
    }
}

function initmarquee() {
    var html = document.getElementById("marquee").innerHTML;
    $("#Home").append(html);
    getMarqueeInfo();
    initSwiperMarquee();
}

var testmarquee = [
    "放到沙发上",
    "开机后可任意",
    "蛋糕",
    "初步成效",
    "额头因而",
    "与他人",
    "特问题二",
    "反对萨嘎斯"
]

function getMarqueeInfo() {        
    var html = "";
    html += "<div class='swiper-wrapper'>";
    
    for (index in testmarquee) {
        html += "<div class='swiper-slide'>";
        html += testmarquee[index];
        html += "</div>";
    }
    html += "</div>";
    $(".swiper-container.marquee").html(html);
    return;
    $.ajax({
        url: "",
        dataType: 'JSON',
        timeout: 5000,
        type: "POST",
        beforeSend: function(xhr){
            xhr.setRequestHeader('pt', 'web');
            xhr.setRequestHeader('app_key', 'test_key');
        },
        success: function(data){
            settime($(".code-btn"), "code-btn-ing");
            if (data.code == 200) {
            } else if (data.code == 500) {
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
}

function initSwiperMarquee() {
    var swiperMarquee = new Swiper('.swiper-container.marquee', {
        direction: 'vertical',
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: true,
        pagination: {
            el: '.swiper-pagination'
        }
    });
}

function initHomeNav() {
    var html = document.getElementById("HomeNav").innerHTML;
    $("#Home").append(html);
}

function initHomeList() {
    var html = document.getElementById("HomeList").innerHTML;
    $("#Home").append(html);
    initHomeListDropload();
}

// 页数
var page = 0;
var size = 10;
var racesIndex = "0";

function initHomeListDropload() {
    // dropload
    var dropload = $('.HomeList').dropload({
        domUp : {
            domClass   : 'dropload-up',
            domRefresh : '<div class="dropload-refresh">下拉可以刷新</div>',
            domUpdate  : '<div class="dropload-update">松开立即刷新</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span></div>'
        },
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">向上滑动加载更多</div>',
            domLoad    : '<div class="dropload-load"><div style="text-align: center; height: 50px;"><img src="' + testUrl + 'images/loading1.gif" alt="" style="width: 100px;"></div></div>',
            domNoData  : '<div class="dropload-noData">没有更多赛事</div>'
        },
        loadUpFn : function(me){
            $.ajax({
                url: "api/core/races2",
                dataType: 'JSON',
                timeout: 5000,
                type: "GET",
                data: {
                    index: 0,
                    size: size,
                    sort: "desc"
                },
                beforeSend: function(xhr){
                    xhr.setRequestHeader('pt', 'web');
                    xhr.setRequestHeader('app_key', 'test_key');
                },
                success: function(data){
                    if (data.code == 200) {
                        racesIndex = 0;
                        var data = data.data;
                        raceIndex = data.index;
                        var arrLen = data.items.length;
                        var result = '';
                        if (arrLen > 0) {
                            for(var i = arrLen - 1; i >= 0; i--) {
                                result +=  '<div class="list">';
                                result +=  '<div id="' + data.items[i].race_id + '" class="detail" style="cursor:pointer;">';
                                result +=  '<div class="left">';
                                result +=  '<img src="' + data.items[i].team_a.logo + '" alt="">';
                                result +=  '<div class="team-name">' + data.items[i].team_a.short_name + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="center">';
                                result +=  '<div class="time">' + timestampToDate(data.items[i].race_ts) + '</div>';
                                result +=  '<div class="name">' + data.items[i].race_name + '</div>';
                                result +=  '<div class="btn">';
                                switch(data.items[i].status) {
                                case 'ready':
                                    result +=  '<div class="ing">' + 竞猜 + '</div>';
                                    break;
                                case 'end':
                                    result +=  '<div class="ing">' + data.items[i].score_a + ':' + data.items[i].score_b + '</div>';
                                    break;
                                }
                                result +=  '</div>';
                                result +=  '</div>';
                                result +=  '<div class="right">';
                                result +=  '<img src="' + data.items[i].team_b.logo + '" alt="">';
                                result +=  '<div class="team-name">' + data.items[i].team_b.short_name + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="show-div">';
                                result +=  '<div class="rotate-dowm"></div>';
                                result +=  '</div>';
                                result +=  '</div>';

                                result +=  '<div class="detail-list">';
                                result +=  '<div id="' + data.items[i].race_id + '" class="room">';
                                result +=  '<div class="room_bet_list">';
                                result +=  '<ul id="ul-' + data.items[i].race_id + '">'
                                result +=  '</ul>';
                                result +=  '</div>';

                                result +=  '<div id="ul-lists-' + data.items[i].race_id + '">';
                                result +=  '</div>';

                                result +=  '</div>';    
                                result +=  '</div>';

                                result +=  '</div>';
                            }
                        } else {
                            dropload.noData();
                        }
                    } else if (data.code == 500) {
                        dropload.noData();
                    }
                    setTimeout(function(){
                        $('.lists').html(result);
                        dropload.resetload();
                    }, 200);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('error ' + textStatus + " " + errorThrown);
                    dropload.resetload();
                }
            });
        },
        loadDownFn : function(me){
            $.ajax({
                type: 'GET',
                url: "api/core/races2",
                timeout: 5000,
                dataType: 'JSON',
                data: {
                    index: racesIndex,
                    size: size,
                    sort: "asc"
                },
                beforeSend: function(xhr){
                    xhr.setRequestHeader('pt', 'web');
                    xhr.setRequestHeader('app_key', 'test_key');
                },
                success: function(data) {
                    if (data.code == 200) {                    
                        var data = data.data;
                        racesIndex = data.index;
                        var arrLen = data.items.length;
                        if (arrLen > 0) {
                            var result = '';
                            for(var i = arrLen - 1; i >= 0; i--) {
                                result +=  '<div class="list">';
                                result +=  '<div id="' + data.items[i].race_id + '" class="detail" style="cursor:pointer;">';
                                result +=  '<div class="left">';
                                result +=  '<img src="' + data.items[i].team_a.logo + '" alt="">';
                                result +=  '<div class="team-name">' + data.items[i].team_a.short_name + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="center">';
                                result +=  '<div class="time">' + timestampToDate(data.items[i].race_ts) + '</div>';
                                result +=  '<div class="name">' + data.items[i].race_name + '</div>';
                                result +=  '<div class="btn">';
                                switch(data.items[i].status) {
                                case 'ready':
                                    result +=  '<div class="ing">竞猜</div>';
                                    break;
                                case 'end':
                                    result +=  '<div class="ing">' + data.items[i].score_a + ':' + data.items[i].score_b + '</div>';
                                    break;
                                }
                                result +=  '</div>';
                                result +=  '</div>';
                                result +=  '<div class="right">';
                                result +=  '<img src="' + data.items[i].team_b.logo + '" alt="">';
                                result +=  '<div class="team-name">' + data.items[i].team_b.short_name + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="show-div">';
                                result +=  '<div class="rotate-dowm"></div>';
                                result +=  '</div>';
                                result +=  '</div>';

                                result +=  '<div class="detail-list">';
                                result +=  '<div class="room">';
                                result +=  '<div class="room_bet_list">';
                                result +=  '<ul id="ul-' + data.items[i].race_id + '">'
                                result +=  '</ul>';
                                result +=  '</div>';

                                result +=  '<div id="ul-lists-' + data.items[i].race_id + '">';
                                result +=  '</div>';

                                result +=  '</div>';    
                                result +=  '</div>';
                                    
                                        
                                    
                                
                                result +=  '</div>';
                            }
                        // 如果没有数据
                        } else {
                            dropload.noData();
                        }
                    } else if (data.code == 500) {
                        dropload.noData();
                    }
                    setTimeout(function(){
                        // 插入数据到页面，放到最后面
                        $('.lists').append(result);
                        // 每次数据插入，必须重置
                        dropload.resetload();
                    }, 200);
                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        }
    });

}


function timestampToDate(timestamp) {
    var date = new Date(parseInt(timestamp));
    Y = date.getFullYear() + '年';
    M = (date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1) + '月';
    D = date.getDate() + '日 ';
    h = date.getHours() + ':';
    m = date.getMinutes();
    s = date.getSeconds();
    return Y + M + D + h + m + s;
}

function showDetailList() {
    $(document).on("click", ".detail", function(){
        var select = $(this).find("div.show-div");
        var selcectChildren = select.children();
        var race_id = $(this).attr("id");
        if (selcectChildren.hasClass("rotate-top")) {
            selcectChildren.removeClass("rotate-top");
            $(this).next("div.detail-list").removeClass("show");
        } else {
            selcectChildren.addClass("rotate-top");
            $(this).next("div.detail-list").addClass("show");

            $.ajax({
                type: 'GET',
                url: "api/core/race2/" + race_id,
                timeout: 5000,
                dataType: 'JSON',
                beforeSend: function(xhr){
                    xhr.setRequestHeader('pt', 'web');
                    xhr.setRequestHeader('app_key', 'test_key');
                },
                success: function(data) {
                    if (data.code == 200) {                    
                        var data = data.data.betting_tps;
                        var arrLen = data.length;
                        var html = '';
                        if (arrLen == 1) {
                            html += '<li data-battlenumber="' + race_id + "/" + data[0].tp + '" class="room-bet-menu-0 room_bet_1_click_1 room_bet_1_click">';
                            html += '<span>' + data[0].tp_name + '</span>';
                            html += '</li>';
                        } else {
                            for (var index in data) {
                                if (index > 0) {
                                    html += '<li data-battlenumber="' + race_id + "/" + data[index].tp + '" class="room-bet-menu-1">';
                                } else {
                                    html += '<li data-battlenumber="' + race_id + "/" + data[index].tp + '" class="room-bet-menu-1 room_bet_1_click">';
                                }
                                html += '<span>' + data[index].tp_name + '</span>';
                                html += '</li>';
                            }
                        }
                        
                        $("ul#ul-" + race_id).html(html);
                        /*initBattleNumbers(race_id);*/
                        loadGuess(race_id + "/" + data[0].tp);
                    } else if (data.code == 500) {
                        console.log('data.code = ' + data.msg);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('error ' + textStatus + " " + errorThrown);
                }
            });
        }
    });
}


function initBattleNumbers(_race_id) {
    $("#ul-" + _race_id + " li").unbind().click(function() {
        $("#ul-" + _race_id + " li").removeClass("room_bet_1_click");
        $(this).addClass("room_bet_1_click");
        var battleNumber = $(this).attr("data-battleNumber");
        loadGuess(battleNumber);
    });
};


function loadGuess(_battleNumber) {
    $.ajax({
        type: 'GET',
        url: "api/core/race2/" + _battleNumber,
        timeout: 5000,
        dataType: 'JSON',
        beforeSend: function(xhr){
            xhr.setRequestHeader('pt', 'web');
            xhr.setRequestHeader('app_key', 'test_key');
        },
        success: function(data) {
            if (data.code == 200) {
                var data = data.data;
                var html = '';
                for (var dataIndex in data) {
                    html += '<dl class="room_bet_lists">';
                    html += '<dt>';
                    html += '<b>' + data[dataIndex].title + '</b>';
                    html += '</dt>';
                    html += '<dd>';
                    var dataItems = data[dataIndex].items;
                    for(var itemsIndex in dataItems) {
                        html += '<p data-guesstitle="' + data[dataIndex].title + '" data-itemname="' + dataItems[itemsIndex].title + '" data-itemrate="' + dataItems[itemsIndex].odds + '" data-battleId="' + dataItems[itemsIndex].betting_id + '" data-itemId="' + dataItems[itemsIndex].betting_item_id + '" data-raceId="' + data[dataIndex].race_id + '" class="room-bet-win-0 room-bet-p-2">';
                        html += '<i>' + dataItems[itemsIndex].title + '</i> ';
                        html += '<b>' + dataItems[itemsIndex].odds + '</b>';
                        html += '</p>';
                    }
                    html += '</dd>';
                    html += '</dl>';
                }
                $("div#ul-lists-" + data[0].race_id).html(html);
                setTimeout(function() {
                    initBattleNumbers(data[0].race_id);
                    initJoinGuessEvent();
                }, 200);
            } else if (data.code == 500) {

            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
};

function initBottom() {
    var data = getSessionStorage("bottomLinkType");
    var html = document.getElementById("Bottom-Link").innerHTML;
    var source = '';
    if (data == 1) {
        source = html.replace(reg, function (node, key) { return { 
                'activityLogincss': 'activity-Login activity-Login-close'
              }[key]; });
    } else {
        source = html.replace(reg, function (node, key) { return { 
                'activityLogincss': 'activity-Login'
              }[key]; });
    }
    $("#Home").append(source);
    initSwiperButtom();
    $(".bottom-close").click(function(){
        $(".Bottom-Link").addClass("Bottom-Link-close");
    });
}

function initFoot() {
    var html = document.getElementById("foot").innerHTML;
    $("#Home").append(html);
}

function initSwiperButtom() {
    var swiperbuttom = new Swiper('.swiper-container.buttom', {
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: true,
        pagination: {
            el: '.swiper-pagination'
        }
    });
}

function bindedActivityClose() {
    $(".activity-Login").addClass("activity-Login-close");
    setSessionStorage(sessionStorageJsonKey[2], 1);
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

function initJoinGuessEvent() {
    $(".room_bet_lists dd p").unbind().click(function() {
        window_show("betpay");
        $(".window-support").hide();
        var battleId = $(this).attr("data-battleId");
        var guessId = $(this).attr("data-guessId");
        var itemId = $(this).attr("data-itemId");
        var itemName = $(this).attr("data-itemName");
        var itemRate = $(this).attr("data-itemRate");
        var guessTitle = $(this).attr("data-guessTitle");
        var battleNumber = $(".room-bet .room-bet-menu-click").text();
        $('.window-betpay .title').text(battleNumber + " " + guessTitle + " " + itemName);
        var num = new Number(itemRate);
        $('.window-betpay .rate').text("赔率：" + num.toFixed(2));
        var param = [];
        param.push(itemId);
        $('.window-betpay .btn-join').unbind().click(function() {
            var gold = $('.window-betpay .gold').val();
            var userInfo = getSessionStorage(sessionStorageJsonKey[1]);
            if (userInfo == null) {
                $(".window").hide();
                $(".window").children().hide();
                $(".window h2").parent().hide();
                msg_show(false, "请登录...");
                return;
            } else if (parseInt(gold) > userInfo.coin) {
                $(".window").hide();
                $(".window").children().hide();
                $(".window h2").parent().hide();
                msg_show(false, "请充值...");
                return;
            } else if (parseInt(gold) < 10) {
                $(".window").hide();
                $(".window").children().hide();
                $(".window h2").parent().hide();
                msg_show(false, "下注金额必须大于10");
                return;
            }
            var params = {
                'coin': gold,
                'betting_item_id_list': param
            };

            $.ajax({
                type: 'POST',
                url: "api/core/betting",
                timeout: 5000,
                dataType: 'JSON',
                contentType: 'application/json;charset=uft-8',
                data: JSON.stringify(params),
                beforeSend: function(xhr){
                    sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
                },
                success: function(data) {
                    if (data.code == 200) {                    
                        $(".window").hide();
                        $(".window").children().hide();
                        $(".window h2").parent().hide();
                        msg_show(true, data.msg);
                        $(".room_bet_list ul .room_bet_1_click").click();
                        getUserInfo();
                    } else if (data.code == 500) {

                    } else if (data.code == 498) {
                        msg_show(false, data.msg);
                    } else if (data.code == 403) {
                        $(".window").hide();
                        $(".window").children().hide();
                        $(".window h2").parent().hide();
                        msg_show(true, data.msg);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('error ' + textStatus + " " + errorThrown);
                }
            });
        });
    });
};