(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1adc3992"],{"158e":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("m-content",[e("div",{staticClass:"flex make-contract-title make-contract-title-top"},[e("p",{staticClass:"flex-1 text-align-left title-left"},[t._v("企业认证信息")]),e("p",{staticClass:"flex-1 text-align-right title-right"},[t.hasCertified?e("a",{staticClass:"font-blue"},[t._v("已认证")]):e("router-link",{staticClass:"font-blue",attrs:{to:"/certify/idCardOCR"}},[t._v("未认证 马上认证")])],1)]),e("div",{staticClass:"credit-form"},[e("m-form-row",{attrs:{label:"企业名称"}},[e("span",[t._v(t._s(t.formData.orgName))])]),e("m-form-row",{attrs:{label:"企业证件类型"}},[e("span",[t._v(t._s(t.formData.cardTypeStr))])]),e("m-form-row",{attrs:{label:"社会统一信用代码",labelWidth:"250"}},[e("span",[t._v(t._s(t.formData.orgNo))])]),e("m-form-row",{attrs:{label:"企业法人代表"}},[e("span",[t._v(t._s(t.formData.representName))])]),e("m-form-row",{attrs:{label:"企业法人身份证"}},[e("span",[t._v(t._s(t.formData.representNo))])])],1),e("div",{staticClass:"flex make-contract-title mt-100"},[e("p",{staticClass:"flex-1 text-align-left title-left"},[t._v("业务信息")])]),e("div",{staticClass:"m-list-wrap"},t._l(t.bussInfo,function(a,s){return e("div",{key:s,staticClass:"flex m-list-item",on:{click:function(e){return t.skipPage(a.url,s)}}},[e("div",{staticClass:"flex-1 text-align-left table-cell title-left",attrs:{href:a.url}},[e("span",{staticClass:"title"},[t._v(t._s(a.title))]),e("img",{staticClass:"img"})]),e("div",{staticClass:"flex-1 table-cell text-align-right title-right",class:[t.hasCertified?"bottom":""]},[e("span",{staticClass:"gray"},[t._v(t._s("0"===a.state?a.tips:a.amtTips))]),"1"===a.state?e("span",{staticClass:"amount"},[t._v(t._s(t._f("formatMoney")(a.amount)))]):t._e()])])}),0)])},i=[],r=e("a4bb"),n=e.n(r),o=e("d225"),l=e("b0b4"),c=e("308d"),f=e("6bb5"),u=e("4e2b"),d=e("9ab4"),m=e("60a3"),p=function(t){function a(){var t;return Object(o["a"])(this,a),t=Object(c["a"])(this,Object(f["a"])(a).apply(this,arguments)),t.formData={orgName:"美的小额贷",cardTypeStr:"证件",orgNo:"111111",representName:"美的金融",representNo:"111233454"},t.bussInfo=[{title:"美的分期",state:"0",tips:"申请开通",amtTips:"待结算",amount:5e4,url:""},{title:"美E贷",state:"0",tips:"最高可申请120万，马上申请",amount:1e3,amtTips:"可用余额",url:"/account/orderList"},{title:"美的支付",state:"0",tips:"银联、微信支付，一键开通",amtTips:"可用额度",amount:2e4,url:""}],t.hasCertified=!0,t.isCredit=!1,t}return Object(u["a"])(a,t),Object(l["a"])(a,[{key:"created",value:function(){this.fetchAccountInfo()}},{key:"skipPage",value:function(t,a){t=this.hasCertified?t:"/certify/idCardOCR",1===a&&this.hasCertified&&!this.isCredit&&(t="/wx/credit/qrcode"),this.$router.$push(t)}},{key:"fetchAccountInfo",value:function(){var t=this;this.$get(this.api.fetchAccountInfo,{}).then(function(a){console.log("account center info:",a);for(var e=n()(t.formData),s=0;s<e.length;s++){var i=e[s];t.formData[i]=a.data[i]}t.hasCertified="1"===a.data.status||!1,t.bussInfo[0].state=a.data.mideaProduct.fenqiMStatus,t.bussInfo[0].amount=a.data.mideaProduct.fenqiUnsettle,t.bussInfo[1].state=a.data.mideaProduct.mideaEStatus,t.bussInfo[1].amount=a.data.mideaProduct.mideaELimit,t.bussInfo[2].state=a.data.mideaProduct.mideaPayStatus,t.bussInfo[2].amount=a.data.mideaProduct.mideaPayLimit})}},{key:"fetchCreditStatus",value:function(){var t=this;this.$get(this.api.fetchCreditStatus,{username:"SG000065501"}).then(function(a){console.log("美E贷是否授信：",a),t.isCredit="true"===a.data||!1})}}]),a}(m["d"]);p=d["a"]([m["a"]],p);var h=p,b=h,v=(e("6538"),e("2877")),C=Object(v["a"])(b,s,i,!1,null,"7b7fcf5c",null);a["default"]=C.exports},6538:function(t,a,e){"use strict";var s=e("88ec"),i=e.n(s);i.a},"88ec":function(t,a,e){}}]);