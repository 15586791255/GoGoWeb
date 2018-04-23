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

var requestUrl = '';

function bindedbackbtn() {
    $(".back-btn").click(function(){
        javascript:history.back(-1);
    });
}

$(function() {
    initalipay();
    bindedbackbtn();
});

// 支付宝支付
function initalipay() {
  $.ajax({
      url: "api/pay/alipay/phone/order/coin_plan/" + Request['coin_plan_id'],
      dataType: 'JSON',
      timeout: 50000,
      async: false,
      type: "POST",
      beforeSend: function(xhr){
          sendHeader(xhr, getSessionStorage(sessionStorageJsonKey[0]));
      },
      success: function(data){
          if (data.code == 200) {
            $("#Home").append(data.data);
            /*var appendButton = '<div class="wrapper buy-wrapper">\
                    <a href="javascript:void(0);" class="J-btn-submit btn mj-submit btn-strong btn-larger btn-block">确认支付</a>\
                </div></form>';

            var payInfo = document.getElementById("payInfo").innerHTML;
            var sourcepayInfo = payInfo.replace(reg, function (node, key) { return { 
                    'amount': Request['pay'],
                    'coin_plan_id' : Request['coin_plan_id']
                  }[key]; });
            $("#Home").append(sourcepayInfo);
            var index = data.data.indexOf('</form>');
            var url = data.data.substr(0, index);
            url += appendButton;
            $("#alipay").append(data.data);

            /*var btn = document.querySelector(".J-btn-submit");
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();


                var bizStr = document.querySelector("input[type=hidden]").value;

                var queryParam = '';
                queryParam += 'bizcontent=' + encodeURIComponent(bizStr);*/
                /*Array.prototype.slice.call(document.querySelectorAll("input[type=hidden]")).forEach(function (ele) {
                    queryParam += '&' + ele.name + "=" + encodeURIComponent(ele.value);
                });*/
                /*var gotoUrl = document.querySelector("form[name=punchout_form]").getAttribute('action') + '&' + queryParam;
                _AP.pay(gotoUrl);

                return false;
            }, false);*/


          } else if (data.code = 500) {
              Toast("参数异常", 1000);
          }
      },
      error: function(jqXHR, textStatus, errorThrown){
          Toast("连接超时", 1000);
          console.log('error ' + textStatus + " " + errorThrown);
      }
  });
}

function sendRequest() {
  var btn = document.querySelector(".J-btn-submit");
  btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      /*var bizMap = {
          "body":"对一笔交易的具体描述信息",
          "out_trade_no":"70501111111S001111119",
          "product_code":"QUICK_WAP_PAY",
          "seller_id":"2088102147948060",
          "subject":"商品名",
          "total_amount":9.00
      };
      var bizStr = JSON.stringify(bizMap);

      var queryParam = '';
      queryParam += 'bizcontent=' + encodeURIComponent(bizStr);*/
      Array.prototype.slice.call(document.querySelectorAll("input[type=hidden]")).forEach(function (ele) {
          queryParam += '&' + ele.name + "=" + encodeURIComponent(ele.value);
      });
      var gotoUrl = document.querySelector("#pay_form").getAttribute('action') + '?' + queryParam;
      _AP.pay(gotoUrl);

      return false;
  }, false);

}