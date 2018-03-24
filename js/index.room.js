function bindBtn() {
    $(".back-btn").click(function(){
        javascript:history.back(-1);
    });
}

var race_id = null;

$(function() {
    race_id = getSessionStorage(sessionStorageJsonKey[3]);
    initRoom();
});

function timestampToDate(timestamp) {
    var date = new Date(parseInt(timestamp));
    Y = date.getFullYear() + '年';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日 ';
    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())  + ':';
    m = date.getMinutes();
    s = date.getSeconds();
    return Y + M + D + h + m + s;
}

function initRoom() {
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
                requestBetlist(coin);
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

function requestBetlist(_coin) {
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
                var race = data.data.race;
                var betting_tps = data.data.betting_tps;
                var arrLen = betting_tps.length;
                var gift_a = data.data.race.team_a_gift;
                var gift_b = data.data.race.team_b_gift;
                if(_coin != undefined && _coin != null && _coin != "") {
                    var vote_a = 0;
                    var vote_b = 0;
                    var gift_a_map = {};
                    var gift_b_map = {};
                    for (var index in gift_a) {
                        gift_a_map[gift_a[index].coin_plan_id] = gift_a[index].total_gift; 
                    }
                    for (var index in gift_b) {
                        gift_b_map[gift_b[index].coin_plan_id] = gift_b[index].total_gift; 
                    }
                    for (var key in _coin) {
                        var a_gift_count = gift_a_map[_coin[key].coin_plan_id];
                        var b_gift_count = gift_b_map[_coin[key].coin_plan_id];
                        var fee = _coin[key].fee;
                        if (a_gift_count != null && a_gift_count > 0) {
                            vote_a += a_gift_count * fee;
                        }
                        if (b_gift_count != null && b_gift_count > 0) {
                            vote_b += b_gift_count * fee;
                        }
                    }
                }
                if (vote_a + vote_b == 0) {
                    vote_a = 1;
                    vote_b = 1;
                }
                var room = document.getElementById("room").innerHTML;
                var sourceLogined = room.replace(reg, function (node, key) { return {
                    'race_id': race.race_id,
                    'title_name': race.race_name,
                    'time': timestampToDate(race.race_ts),
                    'team_a_id': race.team_a.team_id,
                    'team_a_logo': race.team_a.logo,
                    'team_a_name': race.team_a.team_name,
                    'score': race.score_a + " : " + race.score_b,
                    'team_b_id': race.team_b.team_id,
                    'team_b_logo': race.team_b.logo,
                    'team_b_name': race.team_b.team_name,
                    'team_a_rate': changeTwoDecimal(100 * vote_a / (vote_a + vote_b)) + "%",
                    'team_b_rate': changeTwoDecimal(100 * vote_b / (vote_a + vote_b)) + "%"
                  }[key]; });
                $("#Home").append(sourceLogined);
                bindBtn();
	            var html = '';
	            if (arrLen == 1) {
	                html += '<li data-battlenumber="' + race.race_id + "/" + betting_tps[0].tp + '" class="room-bet-menu-0 room_bet_1_click_1 room_bet_1_click">';
	                html += '<span>' + betting_tps[0].tp_name + '</span>';
	                html += '</li>';
	            } else {
	                for (var index in betting_tps) {
	                    if (index > 0) {
	                        html += '<li data-battlenumber="' + race.race_id + "/" + betting_tps[index].tp + '" class="room-bet-menu-1">';
	                    } else {
	                        html += '<li data-battlenumber="' + race.race_id + "/" + betting_tps[index].tp + '" class="room-bet-menu-1 room_bet_1_click">';
	                    }
	                    html += '<span>' + betting_tps[index].tp_name + '</span>';
	                    html += '</li>';
	                }
	            }
	            $("ul#ul").html(html);
                initSupportEvent();
	            loadGuess(race.race_id + "/" + betting_tps[0].tp);
	        } else if (data.code == 500) {
	            console.log('data.code = ' + data.msg);
	        } else if (data.code == 404)　{
                window.location.href = $("base").attr("href") + testUrl + "index.html";
            }
	    },
	    error: function(jqXHR, textStatus, errorThrown){
	        console.log('error ' + textStatus + " " + errorThrown);
	    }
	});
}

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
                        if (dataItems[itemsIndex].status == "win") {
                            html += '<p data-guesstitle="' + data[dataIndex].title + '" data-itemname="' + dataItems[itemsIndex].title + '" data-itemrate="' + dataItems[itemsIndex].odds + '" data-battleId="' + dataItems[itemsIndex].betting_id + '" data-itemId="' + dataItems[itemsIndex].betting_item_id + '" data-raceId="' + data[dataIndex].race_id + '" class="room-bet-win-0 room-bet-p-2 room-bet-win">';
                        } else {
                            html += '<p data-guesstitle="' + data[dataIndex].title + '" data-itemname="' + dataItems[itemsIndex].title + '" data-itemrate="' + dataItems[itemsIndex].odds + '" data-battleId="' + dataItems[itemsIndex].betting_id + '" data-itemId="' + dataItems[itemsIndex].betting_item_id + '" data-raceId="' + data[dataIndex].race_id + '" class="room-bet-win-0 room-bet-p-2">';
                        }
                        
                        html += '<i>' + dataItems[itemsIndex].title + '</i> ';
                        html += '<b>' + changeTwoDecimal(dataItems[itemsIndex].odds) + '</b>';
                        html += '</p>';
                    }
                    html += '</dd>';
                    html += '</dl>';
                }
                $("div#ul-lists").html(html);
                setTimeout(function() {
                    initBattleNumbers(data[0].race_id);
                    initJoinGuessEvent();
                }, 200);
            } else if (data.code == 500) {

            } else if (data.code == 404) {
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
};

function initBattleNumbers(_race_id) {
    $("#ul li").unbind().click(function() {
        $("#ul li").removeClass("room_bet_1_click");
        $(this).addClass("room_bet_1_click");
        var battleNumber = $(this).attr("data-battleNumber");
        loadGuess(battleNumber);
    });
};

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
        var userInfo = getSessionStorage(sessionStorageJsonKey[1]);
        if (userInfo != false) {
            $('.window-betpay .my-gold').text(userInfo.coin);
        }
        $('.window-betpay .title').text(battleNumber + " " + guessTitle + " " + itemName);
        var num = new Number(itemRate);
        $('.window-betpay .rate').text("赔率：" + num.toFixed(2));
        var param = [];
        param.push(itemId);
        $('.window-betpay .btn-join').unbind().click(function() {
            var gold = $('.window-betpay .gold').val();
            var userInfo = getSessionStorage(sessionStorageJsonKey[1]);
            if (userInfo == false) {
                $(".window").hide();
                $(".window").children().hide();
                $(".window h2").parent().hide();
                window.location.href = $("base").attr("href") + testUrl + "login.html";
                return;
            } else if (parseInt(gold) > userInfo.coin) {
                $(".window").hide();
                $(".window").children().hide();
                $(".window h2").parent().hide();
                window.location.href = $("base").attr("href") + testUrl + "recharge.html";
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
                        msg_show(true, "投注成功");
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

function changeTwoDecimal(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}

var supportTeamId, supportTeamName, supportRaceId;

function initSupportEvent() {
    $(".rate").unbind().click(function() {
        supportTeamId = $(this).attr("data-teamId");
        supportTeamName = $(this).attr("data-teamName");
        supportRaceId = $(this).attr("data-raceId");
        loadGifts();
    });
};

var coin_gift;
    
function loadGifts() {
    $.ajax({
        type: 'GET',
        url: "api/core/user",
        timeout: 5000,
        dataType: 'JSON',
        beforeSend: function(xhr){
            sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
        },
        success: function(data) {
            if (data.code == 200) {
                coin_gift = data.data.coin_gift;
                var html = '';
                if (coin_gift.length > 5) {
                    html += '<ul class="least-five">';
                } else {
                    html += '<ul class="most-five">';
                }
                for(var index in coin_gift) {
                    html += '<li data-giftId="' + coin_gift[index].coin_plan_id + '"><img src="' + coin_gift[index].gift_icon + '">';
                    html += '<i>' + coin_gift[index].gift_name  + ' ' + coin_gift[index].total_gift  + '</i>';
                    html += '</li>';
                }
                html += '</li>';
                html += '</ul>';
                $(".window-content").html(html);
                window_show("support");
                initAlert();
            } else if (data.code == 500) {

            } else if (data.code == 404) {
                
            } else if (data.code == 498) {
                myToast(data.msg, 1000, "#F43B47", "0.5rem");
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
};

function initAlert() {
    $('.window-support h1 b').text("支持 " + supportTeamName);
    $('.window-support ul li').unbind().click(function() {
        var giftId = $(this).attr("data-giftId");
        var params = {
            'race_id': supportRaceId,
            'team_id': supportTeamId,
            'coin_plan_id': giftId,
            'total_gift': 1
        };
        $.ajax({
            type: 'POST',
            url: "api/core/race2/coin_gift",
            timeout: 5000,
            dataType: 'JSON',
            data: params,
            beforeSend: function(xhr){
                sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
            },
            success: function(data) {
                if (data.code == 200) {
                    $(".window-support").hide();
                    $(".window").hide();
                    msg_show(true, "支持成功");
                    refreshRate(race_id);
                    refreshUserInfo();
                } else if (data.code == 500) {

                } else if (data.code == 404) {
                    
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    });
}

function refreshRate(_race_id) {
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
                $.ajax({
                    type: 'GET',
                    url: "api/core/race2/" + _race_id,
                    timeout: 5000,
                    dataType: 'JSON',
                    beforeSend: function(xhr){
                        xhr.setRequestHeader('pt', 'web');
                        xhr.setRequestHeader('app_key', 'test_key');
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            var race = data.data.race;
                            var betting_tps = data.data.betting_tps;
                            var arrLen = betting_tps.length;
                            var gift_a = data.data.race.team_a_gift;
                            var gift_b = data.data.race.team_b_gift;
                            if(coin != undefined && coin != null && coin != "") {
                                var vote_a = 0;
                                var vote_b = 0;
                                var gift_a_map = {};
                                var gift_b_map = {};
                                for (var index in gift_a) {
                                    gift_a_map[gift_a[index].coin_plan_id] = gift_a[index].total_gift; 
                                }
                                for (var index in gift_b) {
                                    gift_b_map[gift_b[index].coin_plan_id] = gift_b[index].total_gift; 
                                }
                                for (var key in coin) {
                                    var a_gift_count = gift_a_map[coin[key].coin_plan_id];
                                    var b_gift_count = gift_b_map[coin[key].coin_plan_id];
                                    var fee = coin[key].fee;
                                    if (a_gift_count != null && a_gift_count > 0) {
                                        vote_a += a_gift_count * fee;
                                    }
                                    if (b_gift_count != null && b_gift_count > 0) {
                                        vote_b += b_gift_count * fee;
                                    }
                                }
                            }
                            if (vote_a + vote_b == 0) {
                                vote_a = 1;
                                vote_b = 1;
                            }
                            var rate_a = changeTwoDecimal(100 * vote_a / (vote_a + vote_b)) + "%";
                            var rate_b = changeTwoDecimal(100 * vote_b / (vote_a + vote_b)) + "%";
                            
                            $(".left-bg").find(".rate").text(rate_a);
                            $(".right-bg").find(".rate").text(rate_b);
                        } else if (data.code == 500) {
                            console.log('data.code = ' + data.msg);
                        } else if (data.code == 404)　{
                            window.location.href = $("base").attr("href") + testUrl + "index.html";
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log('error ' + textStatus + " " + errorThrown);
                    }
                });
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