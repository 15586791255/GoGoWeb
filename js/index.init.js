$(function() {
    inithome();
    initHotRaces();
    initHomeList();
    initFoot();
    initDetailEvent();
});

function initHotRaces() {
    var html = document.getElementById("HotSwiper").innerHTML;
    $("#Home").append(html);
    getHotRaces();
}

function getHotRaces() {
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
                var html = "";
                html += "<div class='swiper-wrapper'>";
                for (var index in data) {
                    html += "<div class='swiper-slide slide-content' onclick='entryRaceRoom(" + data[index].race_id + ");'>";
                    html += "<div class='slide-top'>";
                    html += "<div class='title'>" + data[index].race_name + "</div>";
                    html += "<div class='time'>" + timestampToDate(data[index].race_ts) + "</div>";
                    html += "</div>";
                    html += "<div class='slide-bottom'>";
                    html +=  '<div class="left">';
                    html +=  '<img src="' + data[index].team_a.logo + '" alt="">';
                    html +=  '<div class="team-name">' + data[index].team_a.short_name + '</div>';
                    html +=  '</div>';
                    html += "<div class='center'>";
                    html +=  '<div class="score">' + data[index].score_a + ' : ' + data[index].score_b + '</div>';
                    html += "</div>";
                    html +=  '<div class="right">';
                    html +=  '<img src="' + data[index].team_b.logo + '" alt="">';
                    html +=  '<div class="team-name">' + data[index].team_b.short_name + '</div>';
                    html +=  '</div>';
                    html += "<div class='right-btn'>";
                    html += "<div class='btn'>";
                    switch(data[index].status) {
                    case 'ready':
                        html += '<div class="ing">去竞猜</div>';
                        break
                    case 'end':
                        html += '<div class="ing">结果</div>';
                        break;
                    }
                    html += "</div>"
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                }
                html += "</div>";
                $(".swiper-container.hotRaces").prepend(html);
                initSwiperHotRaces(); 
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

function initSwiperHotRaces() {
    var swiperHotRaces = new Swiper('.swiper-container.hotRaces', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      }
    });
}

function inithome() {
    var data = getSessionStorage("userInfo");
    if (data == undefined || data == null || data == '' || data == false) {
        var html = document.getElementById("home-nologin").innerHTML;
        var nologin = document.getElementById("nologin").innerHTML;
        $("#Home").append(html);
        $(".user-info").append(nologin);
    } else {
        initlogined(data);
    }
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
                            for(var i = 0; i < arrLen; i++) {
                                result +=  '<div class="list">';
                                result +=  '<div id="' + data.items[i].race_id + '" class="detail" style="cursor:pointer;">';
                                result += '<div class="top-content">';
                                result += '<div class="left">';
                                result += '<div class="time">' + timestampToDate(data.items[i].race_ts) + '</div>';
                                result += '<div class="name">' + data.items[i].race_name + '</div>';
                                result += '</div>';
                                result += '<div class="right">';
                                result += '<div class="icon"></div>';
                                result += '<div class="ing">';
                                switch(data.items[i].status) {
                                case 'ready':
                                    result += '去竞猜';
                                    break
                                case 'end':
                                    result += '结果';
                                    break;
                                }
                                result += '</div>';
                                result += '</div>';
                                result += '</div>';
                                result += '<div class="bottom-content">';
                                result +=  '<div class="left">';
                                result +=  '<div class="team-logo">';
                                result +=  '<img src="' + data.items[i].team_a.logo + '" alt="">';
                                result +=  '</div>';
                                result +=  '<div class="team-name">' + data.items[i].team_a.short_name + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="center">';
                                result +=  '<div class="score">' + data.items[i].score_a + ' : ' + data.items[i].score_b + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="right">';
                                result +=  '<div class="team-logo">';
                                result +=  '<img src="' + data.items[i].team_b.logo + '" alt="">';
                                result +=  '</div>';
                                result +=  '<div class="team-name">' + data.items[i].team_b.short_name + '</div>';
                                result +=  '</div>';
                                result += '</div>';
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
                                result += '<div class="top-content">';
                                result += '<div class="left">';
                                result += '<div class="time">' + timestampToDate(data.items[i].race_ts) + '</div>';
                                result += '<div class="name">' + data.items[i].race_name + '</div>';
                                result += '</div>';
                                result += '<div class="right">';
                                result += '<div class="icon"></div>';
                                result += '<div class="ing">';
                                switch(data.items[i].status) {
                                case 'ready':
                                    result += '去竞猜';
                                    break
                                case 'end':
                                    result += '结果';
                                    break;
                                }
                                result += '</div>';
                                result += '</div>';
                                result += '</div>';
                                result += '<div class="bottom-content">';
                                result +=  '<div class="left">';
                                result +=  '<div class="team-logo">';
                                result +=  '<img src="' + data.items[i].team_a.logo + '" alt="">';
                                result +=  '</div>';
                                result +=  '<div class="team-name">' + data.items[i].team_a.short_name + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="center">';
                                result +=  '<div class="score">' + data.items[i].score_a + ' : ' + data.items[i].score_b + '</div>';
                                result +=  '</div>';
                                result +=  '<div class="right">';
                                result +=  '<div class="team-logo">';
                                result +=  '<img src="' + data.items[i].team_b.logo + '" alt="">';
                                result +=  '</div>';
                                result +=  '<div class="team-name">' + data.items[i].team_b.short_name + '</div>';
                                result +=  '</div>';
                                result += '</div>';
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
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日 ';
    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())  + ':';
    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())  + ':';
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

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

function initlogined(_data) {
    $("#login-page").remove();
    $(".user-info").remove();
    if (_data.avatar == null || _data.avatar == undefined || _data.avatar == '') {
        _data.avatar = testUrl + 'images/user/def.png';
    }
    var html = document.getElementById("home-logined").innerHTML;
    var source = html.replace(reg, function (node, key) { return { 
        'username': _data.username,
        'coin': _data.coin,
        /*'carcount': '0',*/
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

function entryRaceRoom(_race_id) {
    if(_race_id != undefined && _race_id != null && _race_id != "") {
        setSessionStorage(sessionStorageJsonKey[3], _race_id);
        window.location.href = $("base").attr("href") + testUrl + "room.html";
    }
}

function initDetailEvent() {
    $(document).on("click", ".detail", function(){
        var race_id = $(this).attr("id");
        if (race_id != undefined && race_id != null && race_id != '') {
            setSessionStorage(sessionStorageJsonKey[3], race_id);
            window.location.href = $("base").attr("href") + testUrl + "room.html";
        }
    });
}