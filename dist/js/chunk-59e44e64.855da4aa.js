(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-59e44e64"],{"5df3":function(t,e,n){"use strict";var i=n("02f4")(!0);n("01f9")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=i(e,n),this._i+=t.length,{value:t,done:!1})})},ac6a:function(t,e,n){for(var i=n("cadf"),a=n("0d58"),s=n("2aba"),o=n("7726"),c=n("32e9"),r=n("84f2"),l=n("2b4c"),u=l("iterator"),f=l("toStringTag"),h=r.Array,b={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=a(b),v=0;v<d.length;v++){var g,p=d[v],m=b[p],A=o[p],_=A&&A.prototype;if(_&&(_[u]||c(_,u,h),_[f]||c(_,f,p),r[p]=h,m))for(g in i)_[g]||s(_,g,i[g],!0)}},ef86:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("m-content",[n("h1",[t._v("post请求")]),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.fetchPost}},[t._v("post")]),n("h1",[t._v("get请求")]),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.fetchGet}},[t._v("get")]),n("h1",[t._v("formData请求")]),n("input",{ref:"input-file",attrs:{type:"file"}}),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.postFormData}},[t._v("formData")]),n("h1",[t._v("formData-blob请求")]),n("input",{ref:"input-file-2",attrs:{type:"file"}}),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.postFormData2}},[t._v("formData-blob")]),n("h1",[t._v("并发请求A(4s)+B(1s)+C(6s)")]),n("p",[t._v("只出现一个loading，并且持续6s")]),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.concurrent}},[t._v("并发")]),n("h1",[t._v("串联请求A(4s) => B(1s) => C(6s)")]),n("p",[t._v("只出现一个loading，并且持续11s")]),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.series}},[t._v("串联请求")]),n("h1",[t._v("串并请求A(4s) + B(1s) => C(6s)")]),n("p",[t._v("只出现一个loading，并且持续10s")]),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.concurAndseries}},[t._v("串并联请求")]),n("h1",[t._v("并串请求A(4s)， B(1s) => C(6s)")]),n("p",[t._v("只出现一个loading，并且持续10s")]),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.seriesAndCon}},[t._v("并串联请求")]),n("h1",[t._v("异常请求A(4s)+B(1s)+D")]),n("p",[t._v("不存在D接口，loading直接消失出现toast")]),n("button",{staticClass:"btn btn-lg btn-blue btn-center btn-radius mt-10",on:{click:t.errFetch}},[t._v("异常")])])},a=[],s=n("795b"),o=n.n(s),c=(n("ac6a"),n("5df3"),n("d225")),r=n("b0b4"),l=n("308d"),u=n("6bb5"),f=n("4e2b"),h=n("9ab4"),b=n("60a3"),d=n("8fb6"),v=n("efa4"),g=function(t){function e(){return Object(c["a"])(this,e),Object(l["a"])(this,Object(u["a"])(e).apply(this,arguments))}return Object(f["a"])(e,t),Object(r["a"])(e,[{key:"fetchAjax",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.$post("http://localhost:3000/api/".concat(t),{duration:e})}},{key:"fetchPost",value:function(){this.$post("https://jr.midea.com/home_api/infoAnno/getInfoAnnoList.do",{page:1,pageSize:10,channel:20,clientType:3},{isShowLoading:!0}).then(function(t){t.isSuccess||console.log(t.errorCode)})}},{key:"fetchGet",value:function(){this.$get("https://jr.midea.com/home_api/infoAnno/getInfoAnnoList.do",{page:1,pageSize:10,channel:20,clientType:3},{isShowLoading:!0}).then(function(t){t.isSuccess||console.log(t.errorCode)})}},{key:"postFormData",value:function(){var t=this,e=this.$refs["input-file"];if(e.files&&e.files.length){var n=e.files[0];this.$postFormData(v["a"].uploadImg,{file:n}).then(function(e){t.$post(t.api.downloadImg,{docId:e.data}).then(function(t){var e=new Image;e.src=t.data,console.log(t.data)})})}}},{key:"postFormData2",value:function(){var t=this,e=this.$refs["input-file-2"];if(e.files&&e.files.length){var n=e.files[0];d["a"].getPicDataUrl(n).then(function(e){t.$postFormData(v["a"].uploadImg,{file:d["a"].getPicBlobByDataUrl(e.dataUrl)}).then(function(e){t.$post(t.api.downloadImg,{docId:e.data}).then(function(t){var e=new Image;e.src=t.data})})})}}},{key:"concurrent",value:function(){this.fetchAjax("a",4e3),this.fetchAjax("b",1e3),this.fetchAjax("c",6e3)}},{key:"errFetch",value:function(){this.fetchAjax("a",4e3),this.fetchAjax("b",1e3),this.fetchAjax("d",6e3)}},{key:"series",value:function(){var t=this;this.fetchAjax("a",4e3).then(function(){return t.fetchAjax("b",1e3)}).then(function(){return t.fetchAjax("c",6e3)})}},{key:"concurAndseries",value:function(){var t=this;o.a.all([this.fetchAjax("a",4e3),this.fetchAjax("b",1e3)]).then(function(){t.fetchAjax("c",6e3)})}},{key:"seriesAndCon",value:function(){var t=this;this.fetchAjax("a",4e3),this.fetchAjax("b",1e3).then(function(){t.fetchAjax("c",6e3)})}}]),e}(b["d"]);g=h["a"]([b["a"]],g);var p=g,m=p,A=n("2877"),_=Object(A["a"])(m,i,a,!1,null,null,null);e["default"]=_.exports}}]);