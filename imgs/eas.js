if(typeof EAS!="object"){var EAS=(function(){var c={getUrlVars:function(Am){var Ao=[],An;var Ap=Am.slice(Am.indexOf("?")+1).split("&");for(var Al=0;Al<Ap.length;Al++){An=Ap[Al].split("=");Ao.push(An[0]);Ao[An[0]]=An[1]}return Ao},getUrlVar:function(Al,Am){var An=c.getUrlVars(Al);if(An[Am]==null||An[Am]==undefined){return 0}else{return An[Am]}},loadjs:function(Am,Al,An){var Ao=document.createElement("script");Ao.type="text/javascript";if(An){Ao.setAttribute("charset",An)}if(Ao.readyState){Ao.onreadystatechange=function(){if(Ao.readyState=="loaded"||Ao.readyState=="complete"){Ao.onreadystatechange=null;Al();document.getElementsByTagName("head")[0].removeChild(this)}}}else{Ao.onload=function(){Al();document.getElementsByTagName("head")[0].removeChild(this)}}Ao.src=Am;document.getElementsByTagName("head")[0].appendChild(Ao)},loadimg:function(Am,Al){var An=new Image();An.onload=function(){An=null};An.onerror=function(){An=null};An.src=Am},trim:function(Al){return Al.replace(/^(\s|\u00A0)+/,"").replace(/(\s|\u00A0)+$/,"")},getEasUrl:function(Al){Al.toLowerCase();if(Al.indexOf("?")!=-1){var An=Al.substr(0,Al.indexOf("?"))}else{var An=Al}An=An.replace("index.shtml","").replace("index.html","").replace("index.htm","").replace("index.php","");if(An.indexOf("#")!=-1){An=An.substr(0,An.indexOf("#"))}var Am=An.split("/");var Ao=Am[Am.length-1];if(Ao!=""&&Ao!=undefined&&Ao.indexOf(".shtml")==-1&&Ao.indexOf(".html")==-1&&Ao.indexOf(".htm")==-1&&Ao.indexOf(".php")==-1){An=An+"/"}return An},trimStr:function(Al){if(typeof Al!="string"){Al=Al.toString()}if(Al.indexOf("%")!=-1){Al=Al.substr(0,Al.indexOf("%"))}if(Al.indexOf("#")!=-1){Al=Al.substr(0,Al.indexOf("#"))}rs=Al.replace(/\/|'|#|@|\<|\>|\?|\&|\^|\"/g,"");return rs}};var k=document,x="http://apps.game.qq.com/eas/comm/eas.php?",S="http://apps.game.qq.com/easnew/go/eas.php?",Ad="http://apps.game.qq.com/adw_sendclick/api/send_click.php?",B="http://apps.game.qq.com/fifa/qiyehao/index.php?m=GODMLogin",Ae=window.location.pathname,m=window.location.host,q=window.location.href,O=document.referrer,z=c.getEasUrl(q),p=0,A=0,R=0,h=0,t=0,Ak=Math.floor(Math.random()*10),Ai=false,y=false,g="EAS-ADTAG",M={},o="",w="",r="",Ah="",H="",f="",Q="",F="",V="",N="",Ac="",e="",Ab=new Array(),D=false,U=false,j=new Date().getTime();var Ag=function(Am,Ao,An){var Al=!!navigator.userAgent.match(/Trident\/7\./);if(Al){Am["on"+Ao]=An}else{if(window.attachEvent){Am.attachEvent("on"+Ao,An)}else{Am.addEventListener(Ao,An,false)}}};var n=function(){var An={};An:{var Am=document.getElementsByTagName("script");for(d=0;d<Am.length;d++){var Al=Am[d].src;if(Al&&0<=Al.toLowerCase().indexOf("reporting.js")){e=c.getUrlVar(Al,"action");if(e<50398&&e!=0){Ai=true}break An}}d=""}};var P=function(){var Ap="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";var Al=Ap.length;var Ao="";var An=(new Date()).getTime().toString();if(typeof An!="string"){An=Math.floor(Math.random()*(9999999999999-1000000000000)+1000000000000).toString()}for(i=0;i<13;i++){var Am=Math.floor(Math.random()*Al);Ao+=Ap.charAt(Am)+An[i]}return Ao};var Aj=function(){p=c.getUrlVar(q,"ad_id");if(p==null||p==undefined||p==0){p=c.getUrlVar(q,"e_code");if(p==null||p==undefined){p=0}}else{p="o2."+p}h=c.getUrlVar(q,"mtr_id");if(h==null||h==undefined){h=0}A=c.getUrlVar(q,"g_code");if(A==null||A==undefined){A=0}p=c.trimStr(p);A=parseInt(A);h=parseInt(h)};var C=function(Am){var Al=c.getUrlVar(Am,"ad_id");if(Al==null||Al==undefined||Al==0){Al=c.getUrlVar(Am,"e_code");if(Al==null||Al==undefined){Al=0}}else{Al="o2."+Al}return c.trimStr(Al)};var l=function(Al,An,Ao){var Am=Al+An+"&r="+(new Date()).getTime();if(typeof(Ao)==="function"){c.loadimg(Am,function(){});Ao()}else{c.loadimg(Am,function(){})}};var L=function(Al){c.loadjs("http://pingjs.qq.com/tcss.ping.js",function(){if(typeof(pgvSendClick)==="function"){pgvSendClick({hottag:Al})}})};var X=function(){n();if(!Ai&&!y){y=true;var Al=u("eas_sid");if(Al==undefined||Al==null){Al=P();u;u("eas_sid",Al,{expires:525600,path:"/",domain:"qq.com"})}var Am="click_type=3&e_code="+p+"&o2_mid="+h+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);l(S,Am)}};var Af=function(){if(m=="x5.qq.com"||m=="lol.qq.com"){var Au=k.getElementsByTagName("*"),Ap=Au.length,At,Ao=new Array(),As=0;while(Ap--){At=Au[Ap];var Av="",Al="",Ar="",An="",Am="";Al=At.getAttribute&&At.getAttribute("href");if(typeof Al=="string"&&Al.length>0){Ar=parseInt(c.getUrlVar(Al,"e_code"));if(Ar!=null&&Ar!=undefined&&Ar!=0){Ao.push(Ar);An={e_c:Ar,c_d:Al,c_t:102}}}Av=At.getAttribute&&At.getAttribute(g);if(typeof Av=="string"&&Av.length>0){Ao.push(Av);An={e_c:Av,c_t:102}}if(An||Am){(function(Aw,Ax){EAS.addEvent(At,"click",function(){if(typeof Aw=="object"){W(Aw,function(){})}if(typeof Ax=="object"){W(Ax,function(){})}})})(An,Am)}if(Ap==0){if(Ao.length>0){var Aq=Ao.join("|");var Am={e_c:Aq,c_t:101};W(Am,function(){})}}}}};var W=function(Ax,Ao){if(typeof Ax=="object"){var At=Ax,Ap=0,Aq=0,An="",Ar=0,Av="",Au="",Al="",Am=0,Aw=0,As=0;if(At.e_c!==null&&At.e_c!==undefined){Aq=At.e_c}else{return false}if(At.c_p!==null&&At.c_p!==undefined){As=At.c_p}if(At.c_t!==null&&At.c_t!==undefined){Ap=At.c_t}if(At.c_d!==null&&At.c_d!==undefined){if(typeof At.c_d=="object"){if(At.c_d.href!==null&&At.c_d.href!==undefined){Av=At.c_d.href}}else{Av=At.c_d}}if(Av){Av=c.getEasUrl(Av)}if(parseInt(Ap)==1){Al="show_ads="+Aq+"&Url="+encodeURIComponent(z)+"&click_type=1"}if(parseInt(Ap)==2){Al="show_ads="+Aq+"&ad_url="+encodeURIComponent(Av)+"&ReferrerUrl="+encodeURIComponent(z)+"&click_type=2";Ao=function(){}}if(parseInt(Ap)==4){if(m=="x5.qq.com"){if(D==false&&Aq!="close"){Ab.push(Aq)}if(Ab.length==1){setTimeout(function(){if(Ab.length>0){var Ay=Ab.join("|");Al="click_type=4&adtag="+Ay+"&e_code="+p+"&o2_mid="+h+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);Ab=new Array();if(Al){if(typeof(Ao)==="function"){l(S,Al,function(){Ao()})}else{l(S,Al)}}}},5000)}if(Ab.length==5||D==true){var Aq=Ab.join("|");Al="click_type=4&adtag="+Aq+"&e_code="+p+"&o2_mid="+h+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);Ab=new Array()}}else{Al="click_type=4&adtag="+Aq+"&e_code="+p+"&o2_mid="+h+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O)}}if(parseInt(Ap)==99||parseInt(Ap)==100){Al="click_type="+parseInt(Ap)+"&e_code="+Aq+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O)}if(parseInt(Ap)==101){if(Aq.indexOf("|")!=-1){tmp_codeArr=Aq.split("|")}Al="click_type=101&e_code="+Aq+"&c_p="+As+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O)}if(parseInt(Ap)==102){if(Av){Al="click_type=102&e_code="+Aq+"&c_p="+As+"&Url="+encodeURIComponent(Av)+"&ReferrerUrl="+encodeURIComponent(z)}else{Al="click_type=102&e_code="+Aq+"&c_p="+As+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(z)}}if(Al){if(typeof(Ao)==="function"){l(S,Al,function(){Ao()})}else{l(S,Al)}}}};var J=function(Ao){var An=[],Al;for(var Am=0,Ap;(Ap=Ao[Am])!=null;Am++){Al=C(Ap);if(Al!=null&&Al!=undefined&&Al!=0){if(!M[Al]){An.push(Al);M[Al]=true}}}return An};var T=function(Am){var An=new Array(),Al="",Ao="";if(typeof Am=="object"){if(Am.href!==null&&Am.href!==undefined){An.push(Am.href)}}else{if(typeof Am=="string"){if(Am.indexOf("|")!=-1){An=Am.split("|")}else{An.push(Am)}}}if(An.length>0){Al=J(An);if(Al.length>0){Ao=Al.join("|");W({"e_c":Ao,"c_t":101},function(){})}}};var v=function(Am){var Al,An;if(typeof Am=="object"){if(Am.href!==null&&Am.href!==undefined){An=Am.href}}else{if(typeof Am=="string"){An=Am}}Al=C(An);if(Al!=null&&Al!=undefined){An=c.getEasUrl(An);W({"e_c":Al,"c_d":An,"c_t":102},function(){})}};var b=function(Am,An){var Ap="",Ao="";if(typeof Am=="object"){if(typeof Am.VUrl=="object"){if(Am.VUrl.href!==null&&Am.VUrl.href!==undefined){Am.Url=Am.VUrl.href}}else{if(typeof Am.VUrl=="string"){Am.Url=Am.VUrl}else{if(Am.VUrl==null||Am.VUrl==undefined){Am.Url=q}}}Am.VUrl=null;if(Am.e_code==null||Am.e_code==undefined){if(Am.VType=="click"){Am.e_code=C(Am.Url)}else{if(Am.VType=="play"){Am.e_code=C(q)}}}if(Am.Vid==null||Am.Vid==undefined){if(Am.VType=="click"){Am.Vid=c.getUrlVar(Am.Url,"id")}else{if(Am.VType=="play"){Am.Vid=c.getUrlVar(q,"id")}}}if(Am.Url){Am.Url=c.getEasUrl(Am.Url)}if(Am.VType=="click"){Am.ReferrerUrl=encodeURIComponent(z);Am.click_type=202}else{if(Am.VType=="play"){Am.ReferrerUrl=encodeURIComponent(c.getEasUrl(O));Am.click_type=203}}Am.VType=null;for(var Al in Am){if(Am[Al]!=null&&Am[Al]!=undefined){Ap+=Al+"="+Am[Al]+"&"}}Ap+="m=SendLog"}else{return false}if(Ap!=null&&Ap!=undefined){if(typeof(An)==="function"){l(x,Ap,function(){An()})}else{l(x,Ap)}}};var Y=function(Am,An){var Ap="",Ao="";if(typeof Am=="object"){if(typeof Am.gameid==null||Am.gameid==undefined){return false}Am.Url=z;Am.ReferrerUrl=encodeURIComponent(c.getEasUrl(O));Am.click_type=301;for(var Al in Am){if(Am[Al]!=null&&Am[Al]!=undefined){Ap+=Al+"="+Am[Al]+"&"}}Ap+="m=SendLog"}else{return false}if(Ap!=null&&Ap!=undefined){if(typeof(An)==="function"){l(x,Ap,function(){An()})}else{l(x,Ap)}}};var u=function(An,Aq,Ao){if(typeof Aq!="undefined"){Ao=Ao||{};if(Aq===null){Aq="";Ao.expires=-1}var Am="";if(Ao.expires&&(typeof Ao.expires=="number"||Ao.expires.toUTCString)){var Aw;if(typeof Ao.expires=="number"){Aw=new Date();Aw.setTime(Aw.getTime()+(Ao.expires*60*1000))}else{Aw=Ao.expires}Am="; expires="+Aw.toUTCString()}var At=Ao.path?"; path="+Ao.path:"";var As=Ao.domain?"; domain="+Ao.domain:"";var Av=Ao.secure?"; secure":"";document.cookie=[An,"=",encodeURIComponent(Aq),Am,At,As,Av].join("")}else{var Ap=null;if(document.cookie&&document.cookie!=""){var Al=document.cookie.split(";");for(var Ar=0;Ar<Al.length;Ar++){var Au=c.trim(Al[Ar]);if(Au.substring(0,An.length+1)==(An+"=")){Ap=decodeURIComponent(Au.substring(An.length+1));break}}}return Ap}};var Aa=function(Al){window.location.href=B+"&redirect_url="+Al};var Z=function(Al){if(typeof Al=="object"){if(Al.user!=null&&Al.user!=undefined){Ah=Al.user}if(Al.serviceType!=null&&Al.serviceType!=undefined){H=Al.serviceType}if(Al.sysName!=null&&Al.sysName!=undefined){f=Al.sysName}}var Al="m=SendLog&click_type=501&e_code="+p+"&GODM_user="+Ah+"&GODM_serviceType="+H+"&GODM_sysName="+f+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);l(x,Al,function(){})};var s=function(Al){if(typeof Al=="object"){if(Al.adtag!=null&&Al.adtag!=undefined){GODM_adtag=Al.adtag}else{return false}}else{return false}var Al="m=SendLog&click_type=502&GODM_adtag="+GODM_adtag+"&e_code="+p+"&GODM_user="+Ah+"&GODM_serviceType="+H+"&GODM_sysName="+f+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);l(x,Al,function(){})};var a=function(Al){if(typeof Al=="object"){if(Al.userId!=null&&Al.userId!=undefined){Q=Al.userId}if(Al.openId!=null&&Al.openId!=undefined){F=Al.openId}if(Al.channel!=null&&Al.channel!=undefined){V=Al.channel}if(Al.serviceType!=null&&Al.serviceType!=undefined){N=Al.serviceType}if(Al.sysName!=null&&Al.sysName!=undefined){Ac=Al.sysName}}var Al="m=SendLog&click_type=503&e_code="+p+"&Sys_userId="+Q+"&Sys_openId="+F+"&Sys_channel="+V+"&Sys_serviceType="+N+"&Sys_sysName="+Ac+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);l(x,Al,function(){})};var K=function(Al){if(typeof Al=="object"){if(Al.adtag!=null&&Al.adtag!=undefined){Sys_adtag=Al.adtag}else{return false}}else{return false}var Al="m=SendLog&click_type=504&Sys_adtag="+Sys_adtag+"&e_code="+p+"&Sys_userId="+Q+"&Sys_openId="+F+"&Sys_channel="+V+"&Sys_serviceType="+N+"&Sys_sysName="+Ac+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);l(x,Al,function(){})};var G=function(Al){if(!Al){return false}var Am="click_type=98&e_code="+p+"&o2_mid="+h+"&DJActId="+Al+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);l(S,Am,function(){})};var I=function(){EAS.addEvent(window,"beforeunload",function(){var Al=new Date().getTime();var Am="m=SendLog&click_type=601&e_code="+p+"&StartTime="+j+"&EndTime="+Al+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);D=true;l(x,Am,function(){});if(Ab.length>0&&m=="x5.qq.com"){W({"e_c":"close","c_t":4},function(){})}})};var E=function(Ap){var An="",Aq="",Ar="",Am="",Ao="",Al="",As=0;if(typeof Ap=="object"){if(Ap.ec!=null&&Ap.ec!=undefined){An=Ap.ec}if(Ap.pid!=null&&Ap.pid!=undefined){Aq=Ap.pid}if(Ap.pname!=null&&Ap.pname!=undefined){Ar=Ap.pname}if(Ap.price!=null&&Ap.price!=undefined){Am=Ap.price}if(Ap.categroy!=null&&Ap.categroy!=undefined){Ao=Ap.categroy}if(Ap.brand!=null&&Ap.brand!=undefined){Al=Ap.brand}if(Ap.quantity!=null&&Ap.quantity!=undefined){As=Ap.quantity}}var Ap="m=SendLog&click_type=506&e_code="+p+"&ec="+An+"&pid="+Aq+"&pname="+Ar+"&price="+Am+"&categroy="+Ao+"&brand="+Al+"&quantity="+As+"&Url="+encodeURIComponent(z)+"&ReferrerUrl="+encodeURIComponent(O);l(x,Ap,function(){})};Aj();return{Init:X,ADTAGPop:Af,getUrlVar:c.getUrlVar,SendClick:W,GetECode:C,e_code:p,g_code:A,addEvent:Ag,loadjs:c.loadjs,getEasUrl:c.getEasUrl,trimStr:c.trimStr,Cookie:u,ADShow:T,ADClick:v,VShow:b,GShow:Y,GODMLogin:Aa,GODMInit:Z,GODMClick:s,SysInit:a,SysClick:K,DJClick:G,TimeLine:I,mall:E}})();EAS.addEvent(window,"load",function(){EAS.Init();if(window.location.host=="x5.qq.com"){EAS.TimeLine()}})};/*  |xGv00|2c6fd2490b49f01db1f521482952babe */