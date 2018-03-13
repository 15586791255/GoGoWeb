$(function() {
    initTitle();
    initHistory();
    bindedLoginShow();
    bindedbackbtn();
});

function initTitle() {
    var html = document.getElementById("history").innerHTML;
    $("#Home").append(html);
}

function initHistory() {
    var html = document.getElementById("HomeList").innerHTML;
    $("#Home").append(html);
    initHomeListDropload();
}

var racesIndex = "0";
var page = 0;
var size = 5;

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
            domNoData  : '<div class="dropload-noData">没有更多竞猜历史</div>'
        },
        loadUpFn : function(me){
            $.ajax({
                url: "api/core/betting",
                dataType: 'JSON',
                timeout: 5000,
                type: "GET",
                data: {
                    index: 0,
                    size: size,
                    sort: "desc"
                },
                beforeSend: function(xhr){
                    sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
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
                                var html = '';
                                result +=  '<div class="hlist">';
                                result +=  '<div class="detail" style="cursor:pointer;">';
                                result +=  '<div class="history">';
                                switch(data.items[i].status) {
                                case 'apply':
                                    result +=  '<div class="title"><div class="left">比赛未完成</div><div class="right">-</div></div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">比赛未完成</div></div>';
                                    break;
                                case 'win':
                                    result +=  '<div class="title">赢了</div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">赢了</div></div>';
                                    break;
                                case 'lose':
                                    result +=  '<div class="title">输了</div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">输了</div></div>';
                                    break;
                                case 'invalid':
                                    result +=  '<div class="title">被取消了</div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">被取消了</div></div>';
                                    break;
                                }
                                result +=  '<div class="time"><div class="left">时间</div><div class="right">' + timestampToDate(data.items[i].create_ts) + '</div></div>';
                                result +=  '<div class="race"><div class="left">比赛</div><div class="right">' + data.items[i].race.race_name + '</div></div>';
                                result +=  '<div class="guessing"><div class="left">竞猜</div><div class="right">' + data.items[i].bettings[0].title + '/' + data.items[i].bettings[0].items[0].title + '</div></div>';
                                result +=  '<div class="batting"><div class="left">投注</div><div class="right">竞猜币' + data.items[i].coin + '/赔率' + data.items[i].odds + '</div></div>';
                                result +=  html;
                                result +=  '</div>';
                                result +=  '</div>';
                                result +=  '</div>';
                            }
                        } else {
                            dropload.noData();
                        }
                    } else if (data.code == 500) {
                        dropload.noData();
                    } else if (data.code == 498) {
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
                url: "api/core/betting",
                timeout: 5000,
                dataType: 'JSON',
                data: {
                    index: racesIndex,
                    size: size,
                    sort: "desc"
                },
                beforeSend: function(xhr){
                    sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
                },
                success: function(data) {
                    if (data.code == 200) {                    
                        var data = data.data;
                        racesIndex = data.index;
                        var arrLen = data.items.length;
                        if (arrLen > 0) {
                            var result = '';
                            for(var i = 0; i < arrLen; i++) {
                            	var html = '';
                                result +=  '<div class="hlist">';
                                result +=  '<div class="detail" style="cursor:pointer;">';
                                result +=  '<div class="history">';
                                switch(data.items[i].status) {
                                case 'apply':
                                    result +=  '<div class="title"><div class="left">比赛未完成</div><div class="right">-</div></div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">比赛未完成</div></div>';
                                    break;
                                case 'win':
                                    result +=  '<div class="win"><div class="left">+ ' + data.items[i].coin * data.items[i].odds + '<span>竞猜币</span></div><div class="right">WIN</div></div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">赢</div></div>';
                                    break;
                                case 'lose':
                                    result +=  '<div class="lose"><div class="left">- ' + data.items[i].coin * data.items[i].odds + '<span>竞猜币</span></div><div class="right">LOSE</div></div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">输</div></div>';
                                    break;
                                case 'invalid':
                                    result +=  '<div class="title">被取消</div>';
                                    html = '<div class="result"><div class="left">结果</div><div class="right">被取消</div></div>';
                                    break;
                                }
                                result +=  '<div class="time"><div class="left">时间</div><div class="right">' + timestampToDate(data.items[i].create_ts) + '</div></div>';
                                result +=  '<div class="race"><div class="left">比赛</div><div class="right">' + data.items[i].race.race_name + '</div></div>';
                                result +=  '<div class="guessing"><div class="left">竞猜</div><div class="right">' + data.items[i].bettings[0].title + '/' + data.items[i].bettings[0].items[0].title + '</div></div>';
                                result +=  '<div class="batting"><div class="left">投注</div><div class="right">竞猜币' + data.items[i].coin + '/赔率' + data.items[i].odds + '</div></div>';
                                result +=  html;
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
                    } else if (data.code == 498) {
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
    m = date.getMinutes();
    return Y + M + D + h + m;
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

function bindedbackbtn() {
    $(".back-btn").click(function(){
        javascript:history.back(-1);
    });
}