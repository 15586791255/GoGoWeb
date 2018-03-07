function GetRequest() {
  var url = location.search;
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

var Request = new Object();
Request = GetRequest();

function bindedbackbtn() {
    $(".back-btn").click(function(){
        javascript:history.back(-1);
    });
}

$(function() {
    initpay();
    bindedbackbtn();
    selectpaymentchannel();
});

function initpay() {
    var data = getSessionStorage("userInfo");
    var html = document.getElementById("home").innerHTML;
    var pay = document.getElementById("pay").innerHTML;

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
    var sourcepay = pay.replace(reg, function (node, key) { return { 
            'amount': Request['pay'],
            'coin_plan_id' : Request['coin_plan_id']
          }[key]; });
    $("#Home").append(sourcepay);        
    initalipay();
}

function initalipay() {
  $("#payBox").empty();
  var payBox = "<div class='pay'>需支付 <span>￥" + Request['pay'] + "元</span>";
  payBox += "<a class='btn' href='" + testUrl + "payInfo.html?pay=" + Request['pay'] + "&coin_plan_id=" + Request['coin_plan_id'] + "' style='display: block;'>立即支付</a>";
  payBox += "</div>";
  $("#payBox").append(payBox);
}

function initwxpay() {
  $("#payBox").empty();
  var payBox = "<div class='pay'>需支付 <span>￥" + Request['pay'] + "元</span>";
  payBox += "<a class='btn' href='javascript:;' onclick='requestWxpay();' style='display: block;'>立即支付</a>";
  payBox += "</div>";
  $("#payBox").append(payBox);
}

function selectpaymentchannel() {
    $("div.list").click(function(){
        $("div.list").each(function() {
            $(this).find("div.select-div,.select").removeClass("select");
        })
        $(this).find("div.select-div").addClass("select");
        var flag = $(this).find("div.icon").hasClass("wx-pay");
        if (flag) {
          initwxpay();
        } else {
          initalipay();
        }
    });
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

// 请求支付宝支付
function requestAlipay() {
  $.ajax({
      url: basePath + "api/pay/phone/alipay/order/coin_plan/" + Request['coin_plan_id'],
      dataType: 'JSON',
      timeout: 5000,
      type: "POST",
      beforeSend: function(xhr){
          sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
      },
      success: function(data){
          if (data.code == 200) {
            windows.location.href = 
              $("#payBox").html(data.data);
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
// 请求微信支付
function requestWxpay() {
  $.ajax({
      url: "api/pay/weixin/order/coin_plan/" + Request['coin_plan_id'],
      dataType: 'JSON',
      timeout: 5000,
      type: "POST",
      beforeSend: function(xhr){
          sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
      },
      success: function(data){
          if (data.code == 200) {
            var appId = data.data.app_id;
            var timeStamp = data.data.timestamp;
            var nonceStr = data.data.nonce_str;
            var package = data.data.package;
            var paySign = data.data.sign;
            var url = testUrl + 'wxpay.html?appId=' 
              + appId + "&timeStamp=" + timeStamp + "&nonceStr=" + nonceStr + "&package=" + package 
                + "&paySign=" + paySign;
                alert = url;
            window.location.href = url;
                
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