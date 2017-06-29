/**
 * @author haryli 
 * @version 2.0
 * @date 2012-12-14 
 * @demo 暂无
 * @class Base.window
 * <p>
 * 该js库是商城的基础库，提供商城最基础的方法调用，基于jQuery插件；<br/>
 * 方法集主要包括：通用异步js加载方法<br/>
 * 本类中所有方法被绑定到window对象中，可直接对方法名进行调用。<br/>
 * </p>
 * SVN: $Id: dj_ba.js 34102 2014-05-05 09:24:09Z lantezhang $
 */

/**
 * 原生态编码异步加载js
 * @param {string} url 需要异步加载的js 
 * @param {string} sucfn 加载成功后的回调函数 
 * @param {string} failfn 加载失败后的回调函数 
 * @return {null} 对象
 */	 
var greyBizList = {
	smite: 'smite',
	zzlt: 'zzlt',
	x52: 'x52'
};
 
window.FloadJS = function(url, sucfn, failfn) {
	var FBrowser = {};
	var h = document.getElementsByTagName('HEAD').item(0);
	var js = document.createElement("script");
	
	FBrowser.isIE = ((navigator.userAgent.indexOf('MSIE') == -1) ? false : true);
	FBrowser.isFirefox = ((navigator.userAgent.indexOf('Firefox') == -1) ? false : true);
	FBrowser.isOpera = ((navigator.userAgent.indexOf('Opera') == -1) ? false : true);
	js.type = "text/javascript";
	js.onerror = function() {
		if( typeof (failfn) == "function")
			failfn();
	};
	if(FBrowser.isIE) {
		js.onreadystatechange = function() {
			if(this.readyState.toLowerCase() != "complete" && this.readyState.toLowerCase() != "loaded")
				return;
			if(this.$funExeced != true && typeof (sucfn) == "function") {
				this.$funExeced = true;
				h.removeChild(js);
				sucfn();
			}
		};
	} else {
		js.onload = function() {
			if( typeof (sucfn) == "function") {sucfn();
				h.removeChild(js);
			}
		};
	}
	js.src = url;
	h.appendChild(js);
	if(FBrowser.isOpera && typeof (sucfn) == "function") {sucfn();
		h.removeChild(js);
	}
}

/**
 * 兼容之前版本的方法floadJs
 * @param {string} url 需要异步加载的js 
 * @param {string} sucfn 加载成功后的回调函数 
 * @param {string} failfn 加载失败后的回调函数 
 * @return {null} 对象
 */	 
window.floadJs = window.FloadJS;

/**
 * @author haryli 
 * @version 2.0
 * @date 2012-12-14 
 * @demo 暂无
 * @class Base.Array  
 * <p>
 * 该js库是商城的基础库，提供商城最基础的方法调用，基于jQuery插件；<br/>
 * 方法集主要包括：数组对象的原型扩展<br/>
 * </p>
 */

/**
 * 添加数组检索功能
 * @desc 兼容浏览器（低版本浏览器不支持该方法）
 * @param {object} 需要检索的对象
 * @param {number} 检索的起始位置
 * @return {number} 返回检索对象在数组中的位置
 */	 
Array.prototype.indexOf = function(str,start)
{
	var l = this.length;
	i = i || 0;
	i = i > 0 ? i : 0;
	for ( ; i < l; ++i) if(this[i] === str) return i;
	return -1;
};
/**
 * 获取数组中的最大值
 * @return {number} 返回最大值
 */	
Array.prototype.max = function()
{  
   return Math.max.apply({},this);
}
/**
 * 获取数组中的最小值
 * @return {number} 返回最小值
 */	
Array.prototype.min = function()
{  
   return Math.min.apply({},this);
}

/**
 * @author haryli 
 * @version 2.0
 * @date 2012-12-14 
 * @demo 暂无
 * @class Base.Object
 * <p>
 * 该js库是商城的基础库，提供商城最基础的方法调用，基于jQuery插件；<br/>
 * 方法集主要包括：Object对象的原型扩展<br/>
 * </p>
 */

/**
 * 类对象扩展方法
 * @param {object} destination 需要扩展的对象
 * @param {object} source 对象的扩展方法
 * @return {object} 扩展后的对象 
 */	
Object.extend = function(destination, source) 
{
	for(property in source) {
		destination[property] = source[property];
	}
	return destination;
};

Object.extend(Object.prototype, {
});
Object.extend(Number.prototype, {
});
Object.extend(String.prototype, {
	/**
	 * 解码
	 * @return {string} 解码后的字符串
	 */	 
	decode:function()
	{
	    return unescape(this);
	},
	/**
	 * 获取url解码后的关联对象
	 * @return {object} url解码后的关联对象
	 */	 
	toQueryParams : function() 
	{
		var paramMap={};
	    if(this.length>0) {
	    	if(this.split("?").length>1){
	    		var paramArray = this.split("?")[1].split("&");
	    	}else{
	    		var paramArray = this.split("&");
	    	}
	        for(var i=0;i<paramArray.length;++i) {
	            var paramPair=paramArray[i].split("=");
	            paramPair[0]=paramPair[0].decode();
	            paramPair[1]=paramPair[1]?paramPair[1].decode():"";
	            if(!paramMap[paramPair[0]]) {
	                paramMap[paramPair[0]] = paramPair[1];
	            }
	        }
	    }
	    return paramMap;
	},
	/**
	 * 特殊字符转换成html代码
	 * @return {object} 转换后的html代码
	 */	 
	toHtml:function()
	{
		var CONVERT_ARRAY = [
		                     ["&#38;","&"],
		                     [ "&#32;"," "],
		                     ["&#39;","'" ], 
		                     ["&#34;","\""],
		                     ["&#47;","/"],
		                     ["&#60;","<"],
		                     ["&#62;",">"],
		                     ["&#92;","\\"],
		                     ["&lt;","<"],
		                     ["&nbsp;"," "],
		                     ["&amp;nbsp;"," "],
		                     ["&gt;",">"],
		                     ["&quot;","\""],
		                     [ "<br />","\n"]
		                 ];
		return this.replacePairs.apply(this, CONVERT_ARRAY);
	},
	/**
	 * 特殊字符转换成html代码
	 * @return {object} 转换后的html代码
	 */	 
	toDJHtml:function()
	{
		var CONVERT_ARRAY = [
		                     ["&#38;","&"],
		                     [ "&#32;"," "],
		                     ["&#39;","'" ], 
		                     ["&#34;","\""],
		                     ["&#47;","/"],
		                     ["&#60;","<"],
		                     ["&#62;",">"],
		                     ["&#92;","\\"],
		                     ["&lt;","<"],
		                     ["&nbsp;"," "],
		                     ["&amp;nbsp;"," "],
		                     ["&gt;",">"],
		                     ["&quot;","\""],
		                     [ "<br />","\n"]
		                 ];
		return this.replacePairs.apply(this, CONVERT_ARRAY);
	},
	/**
	 * 批量替换
	 * @param {array} arguments 参数可以传递一个二维数组，叶节点数组，有两个元素，第一个元素是替换源，第二个是替换目标（用第二个元素替换第一个元素）
	 * @return {string} 替换后的字符串
	 */	
	replacePairs:function()
	{
	    var s = this;
	    for (var i=0; i<arguments.length; ++i) {
	        s = s.replaceAll(arguments[i][0], arguments[i][1]);
	    }
	    return s;
	},
	/**
	 * 字符串替换
	 * @param {string} sFrom 替换源
	 * @param {string} sTo 替换目标
	 * @return {string} 替换后的字符串
	 */	 
	replaceAll:function(sFrom,sTo){
		return this.split(sFrom).join(sTo);
	}		
});

Object.extend(Date.prototype, {
	/**
	 * 日期对象格式化输出
	 * @param {string} a 格式化参数，默认：yyyy-MM-dd hh:mm:ss
	 * @return {string} 格式化后的日期字符串
	 */	
	format : function(a) {
		if( typeof (a) != 'string') {
			a = 'yyyy-MM-dd hh:mm:ss';
		}
		var b = a;
		b = b.replace(/yyyy|YYYY/, this.getFullYear());
		b = b.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : "0" + (this.getYear() % 100));
		b = b.replace(/MM/, this.getMonth() > 8 ? (this.getMonth() + 1).toString() : "0" + (this.getMonth() + 1));
		b = b.replace(/M/g, this.getMonth() + 1);
		b = b.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate());
		b = b.replace(/d|D/g, this.getDate());
		b = b.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : "0" + this.getHours());
		b = b.replace(/h|H/g, this.getHours());
		b = b.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : "0" + this.getMinutes());
		b = b.replace(/m/g, this.getMinutes());
		b = b.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : "0" + this.getSeconds());
		b = b.replace(/s|S/g, this.getSeconds());
		return b;
	}
});

/**
 * @author haryli 
 * @version 2.0
 * @date 2012-12-14 
 * @demo 暂无
 * @class Base.jQuery.prototype  
 * <p>
 * 该js库是商城的基础库，提供商城最基础的方法调用，基于jQuery插件；<br/>
 * 方法集主要包括：jQuery对象的原型扩展<br/>
 * 
 <pre><code>
 调用方法：
 $.cookie("name","haryli");
 $.toUTime();
 ...
  </code></pre>
 * </p>
 */
~function($) {
	//outerHTML兼容性设置
	if(!$.browser.msie)
	{
		if (typeof(HTMLElement) != "undefined") {
		   HTMLElement.prototype.__defineSetter__("outerHTML", function(s) {
		        var r = this.ownerDocument.createRange();
		        r.setStartBefore(this);
		        var df = r.createContextualFragment(s);
		        this.parentNode.replaceChild(df, this);
		        return s;
		    });
		   HTMLElement.prototype.__defineGetter__("outerHTML", function(){
		        var a = this.attributes, str = "<" + this.tagName, i = 0;
		        for (; i < a.length; i++)
		            if (a[i].specified)
		                str += " " + a[i].name + '="' + a[i].value + '"';
		        if (!this.canHaveChildren)
		            return str + " />";
		        return str + ">" + this.innerHTML + "<!--" + this.tagName + "-->";
		    });
		
		    HTMLElement.prototype.__defineGetter__("canHaveChildren", function(){
		        return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
		    });
		}
	}
	//jquery 方法扩展
	$.extend({
		/**
		 * 返回剩余的时间
		 * @param {string} nowDate  当前时间，格式（2012-12-21）
		 * @param {string} endDate  结束时间，格式（2012-12-21）
		 * @return {array} [second, minute, hour, day]
		 */	
		showTimeLeft : function(nowDate,endDate) {
			var nowTime = $.toUTime(nowDate);
			var endTime = $.toUTime(endDate);
			
			var leftTime = endTime - nowTime;
	
			if(leftTime < 0) {
				return false;
			}
			var leftsecond = parseInt(leftTime);
			var day1 = Math.floor(leftsecond / (60 * 60 * 24));
			var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
			var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
			var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
	
			return [second, minute, hour, day1];
		},
		/**
		 * 获取服务器时间
		 */	
		getServerDateTime:function(){
			var date = new Date($.ajax({async: false,data:{r:Math.random()}}).getResponseHeader("Date"));
			var datestring = $.date("Y-m-d H:i:s",date.getTime()/1000);
			window.JSON_sys_time={
				"iRet":"0",
				"sMsg":datestring
			};
			return datestring;
		},
		/**
		 * 获取服务器时间
		 */	
		getServerTime:function(){
			var date = new Date($.ajax({async: false,data:{r:Math.random()}}).getResponseHeader("Date"));
			var datestring = $.date("Y-m-d H:i:s",date.getTime()/1000);
			window.JSON_sys_time={
				"iRet":"0",
				"sMsg":datestring
			};
			return date.getTime()/1000;
		},
		/**
		 * 返回剩余的时间
		 * @param {string} part  合并字符
		 * @param {array} arr 需合并的数组
		 * @return {string} 合并后的字符串
		 */	
		implode:function(part,arr){
			var info = "";
			var i=0;
			$.each(arr,function(k,v){
				if(i==0)
				{
					info+=k+part+v;
				}
				else
				{
					info+=part+k+part+v;
				}
				i++;
			});
			return info;
		},
		/**
		 * 单对象模板填充
		 * @param {string} tpl 需要填充的模板内容
		 * @param {number} index 当前对象在数组中的索引值
		 * @param {object} data_in 数据源
		 * @return {object} 填充之后的html元素
		 */	
		fillItemTpl : function(tpl, index, data_in) {
			var data = {};
			if( typeof (data_in) == "object") {
				data = $.extend(data, data_in);
			} else {
				data = data_in;
			}
			if(!tpl)return;
			var tpl_tmp = tpl.replace(/^\s*<!--\s*/, '').replace(/\s*-->\s*$/, '');
			tpl_tmp = tpl_tmp.replaceAll('{i}', index);
			//var isie = $.browser.msie;
			try{
				tpl_tmp = tpl_tmp.replace(/\{#(.*?)\}/gi, function(maths, a) {
					//eval(maths);
					return eval(a);
				});
				$.each(data, function(i, item) {
					item = item==null?"":item;
					item = item.toString();
					tpl_tmp = tpl_tmp.replaceAll('{$' + i + '}', item);
					//.replace(/['"]*/g,"")
					tpl_tmp = tpl_tmp.replaceAll('%7B$' + i + '%7D', item);
				});
				tpl_tmp = tpl_tmp.replace(/\{@@(.*?)\}/gi, function(maths, a) {
					//eval(maths);
					return eval(a);
				});
				tpl_tmp = tpl_tmp.replace(/\{@(.*?)\}/gi, function(maths, a) {
					//eval(maths);
					return eval(a);
				});
			}catch(e)
			{
				window.console&&console.log(e);
			}
			return tpl_tmp;
		},
		/**
		 * 模板填充-依赖方法fillItemTpl
		 * @param {string} tplid 需要填充的模板id
		 * @param {object} datalist 数据源
		 * @param {object} func 填充后的回调函数
		 * @param {object} isasc 是否正序排列，默认正序
		 * @param {object} tpl 如果有这个参数，他会替代tplid这个变量内部的模板数据
		 * @param {object} show_option 数据填充完成后dom元素的显示效果
		 * @return {object} null
		 */	
		fillListTpl : function(tplid, datalist, func, isasc,tpl,show_option) {
			if(datalist==null||!datalist) return false;
			var isasc = typeof(isasc)=="undefined"?true:isasc;
			if(!$.isArray(datalist)){
				datalist = [datalist];
			}
			var $tpl_id = $("#" + tplid);
	
			var tpl_html = "";
	
			if(!$.tpl[tplid]) {
				$.tpl[tplid] = tpl||$tpl_id.html();
			}
			$.each(datalist, function(i, item) {
				var cell_tpl = $.fillItemTpl($.tpl[tplid], i, item);
				if(!isasc) {
					tpl_html = cell_tpl + tpl_html;
				} else {
					tpl_html += cell_tpl;
				}
			});
			
			if(typeof(show_option)!="undefined"){
				$tpl_id.hide().empty().html(tpl_html)[show_option.show](show_option.time,show_option.callback);
			}else{
				$tpl_id.hide().empty().html(tpl_html).show();
			}
	
			if($.isFunction(func)) {
				func(datalist);
			}
		},
		/**
	     * 全局变量，记录页面中调用fillListTpl的模板变量，防止下次填充，重新从页面读取模板
	     * @type {Object}
	     */
		tpl:{},
		/**
		 * json数据解压缩
		 * @param {object} dataList 需要解压缩的对象
		 * @return {object} tpl
		 */	
		parseData : function(dataList) {
			if(!$.isArray(dataList)) {
				return false;
			}
			
			var dataList = $.extend([],dataList);
	
			var assoc_data = [];
	
			var keys = dataList.shift();
	
			$.each(dataList, function(index, item) {
				var obj = {};
				for(var i = 0; i < item.length; i++) {
					obj[keys[i]] = item[i];
				}
				assoc_data.push(obj);
			});
			return assoc_data;
		},
		/**
		 * 客户端qq提醒
		 * @param {string} Title 提醒的标题
		 * @param {string} Content 提醒的内容
		 * @param {string} CType 类型
		 * @param {string} CPTime 提醒的时间
		 * @param {string} CParam 内部参数
		 * @return {object} null
		 */	
		remindQQ : function(Title, Content, CType, CPTime, CParam) {
			window.get_Param2 = function() {
				var sunday = parseInt("1", 2);
				var monday = parseInt("11", 2);
				var tuesday = parseInt("111", 2);
				var wednesday = parseInt("1111", 2);
				var thursday = parseInt("11111", 2);
				var friday = parseInt("111111", 2);
				var saturday = parseInt("1111111", 2);
				return (sunday | monday);
			};
			if(document.all) {
				try {
					var xmlhttp = new ActiveXObject("TimwpDll.TimwpCheck");
					var n = xmlhttp.GetHummerQQVersion();
					if(n < 2509) {
						if(confirm("您未安装QQ或者当前使用的QQ版本过低，请重新安装最新版本QQ。\r\n\r\n安装成功后需要重新启动浏览器，才能正常使用。")) {
							window.target = "_top";
							window.open("http://im.qq.com/qq/#/");
						}
					} else {
						if(CType == 3) {
							CParam = get_Param2();
						}
						var cpAdder = new ActiveXObject("QQCPHelper.CPAdder");
						var retVal = cpAdder.AddMemoNote(Title, Content, CType, CParam, CPTime, 0);
					}
				} catch (e) {
					if(confirm("您未安装QQ或者当前使用的QQ版本过低，请重新安装最新版本QQ。\r\n\r\n安装成功后需要重新启动浏览器，才能正常使用。")) {
						window.target = "_top";
						window.open("http://im.qq.com/qq/#/");
					}
				}
			} else {
				alert("您当前使用的浏览器不支持QQ备忘录提醒功能，目前QQ备忘录提醒功能仅支持IE、TT浏览器。");
				return false;
			}
		},
		/**
		 * json类型数据转换成string类型
		 * @param {object} obj 需要转换的对象
		 * @return {string} 已经转换好的字符串
		 */	
		json2string : function(obj) {
			var THIS = this;
			switch(typeof(obj)) {
				case 'string':
					return '"' + obj.replace(/(["\\])/g, '\\$1').replace(/['"]*/g,"") + '"';
				case 'array':
					return '[' + obj.map(THIS.json2string).join(',') + ']';
				case 'object':
					if( obj instanceof Array) {
						var strArr = [];
						var len = obj.length;
						for(var i = 0; i < len; i++) {
							strArr.push(THIS.json2string(obj[i]));
						}
						return '[' + strArr.join(',') + ']';
					} else if(obj == null) {
						return 'null';

					} else {
						var string = [];
						for(var property in obj)
						string.push(THIS.json2string(property) + ':' + THIS.json2string(obj[property]));
						return '{' + string.join(',') + '}';
					}
				case 'number':
					return obj;
				case false:
					return obj;
			}
		},
		/**
		 * json类型数据转换成数组
		 * @param {object} obj 需要转换的对象
		 * @return {array} 已经转换好的数组
		 */
		json2Array:function(obj){
			var arr = [];
			$.each(obj,function(k,v){
				arr[k] = v;
			})
			return arr;
		},
		/**
		 * cookie 工具类
		 * @param {string} name key
		 * @param {string} value value
		 * @param {object} options expires、path等参数信息
		 * @return {object} max
		 */
		cookie : function(name, value, options) {
			if( typeof value != 'undefined') {
				options = options || {};
				var expires = '';
				var date = new Date();;
				if(value === null) {
					value = '';
					date.setTime(date.getTime()-1);
					expires = '; expires='+ date.toUTCString();
				}else if(options.expires && ( typeof options.expires == 'number' || options.expires.toUTCString)) {
					if( typeof options.expires == 'number') {
						date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
					} else {
						date = options.expires;
					}
					expires = '; expires=' + date.toUTCString();
				}
				var path = options.path ? '; path=' + (options.path) : '; path=/';
				var domain = options.domain ? '; domain=' + (options.domain) : '';
				var secure = options.secure ? '; secure' : '';
				document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
			} else {
				var cookieValue = null;
				if(document.cookie && document.cookie != '') {
					var cookies = document.cookie.split(';');
					for(var i = 0; i < cookies.length; i++) {
						var cookie = jQuery.trim(cookies[i]);
						if(cookie.substring(0, name.length + 1) == (name + '=')) {
							cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
							break;
						}
					}
				}
				if(cookieValue){
					cookieValue = cookieValue.replace('<', '&lt;');
					cookieValue = cookieValue.replace('>', '&gt;');
				}
				return cookieValue;
			}
		},
		/**
		 * 获取文件后缀类型
		 * @param {string} url 文件路径名称
		 * @return {object} max
		 */
		fileType : function(url) {
			var type = url.split(".");
			return type[type.length - 1];
		},
		/**
		 * 加载其他文件资源
		 * @param {string} a_source 资源文件路径
		 * @param {function} func 回调函数
		 * @return {object} max
		 */
		loadSource : function(a_source, func) {
			if(!$.isArray(a_source)) {
				a_source = [a_source];
			}
			var length_ = a_source.length;
			var url_ = a_source.pop();
			var ft = $.fileType(url_);

			if(ft == "js") {
				$.getScript(url_, function() {
					if(length_ != 1) {
						$.loadSource(a_source, func);
					} else {
						func();
					}
				});
			} else {
				$.get(url_, function(data) {
					if(ft == "css") {
						$("<style>" + data + "</style>").appendTo("head");
						if(length_ != 1) {
							$.loadSource(a_source, func);
						} else {
							func();
						}
					}
				});
			}
		},
		/**
		 * 按照时间格式返回当前时间的日期
		 * @param {string} format 日期格式
		 * @param {string} AddDayCount 在当前日期的基础上添加的天数
		 * @param {string} AddMonCount  在当前日期的基础上添加的月数
		 * @param {string} AddYearCount 在当前日期的基础上添加的年数
		 * @return {string} 返回日期字符串“yyyy-m-d”
		 */
		getDateStr : function(format, AddDayCount, AddMonCount, AddYearCount) {
			var AddDayCount = parseInt(AddDayCount) || 0;
			var AddMonCount = parseInt(AddMonCount) || 0;
			var AddYearCount = parseInt(AddYearCount) || 0;
			var dd = new Date();
			dd.setDate(dd.getDate() + AddDayCount);
			dd.setFullYear(dd.getFullYear() + AddYearCount);
			dd.setMonth(dd.getMonth() + AddMonCount);
			return dd.format(format);
		},
		/**
		 * 把string类型的时间转换成时间戳
		 * @param {string} str 日期字符串格式
		 * @param {date} now 日期字符串：yyyy-mm-dd
		 * @return {number} 返回日期的时间戳
		 */
		strtotime : function(str, now) {
			var i, match, s, strTmp = '', parse = '';
			strTmp = str;
			strTmp = strTmp.replace(/\s{2,}|^\s|\s$/g, ' ');
			// unecessary spaces
			strTmp = strTmp.replace(/[\t\r\n]/g, '');
			// unecessary chars
			if(strTmp == 'now') {
				return (new Date()).getTime() / 1000;
				// Return seconds, not milli-seconds
			} else if(!isNaN( parse = new Date(strTmp).getTime())) {
				return (parse / 1000);
			} else if(now) {
				now = new Date(now * 1000);
				// Accept PHP-style seconds
			} else {
				now = new Date();
			}
			strTmp = strTmp.toLowerCase();

			var __is = {
				day : {
					'sun' : 0,
					'mon' : 1,
					'tue' : 2,
					'wed' : 3,
					'thu' : 4,
					'fri' : 5,
					'sat' : 6
				},
				mon : {
					'jan' : 0,
					'feb' : 1,
					'mar' : 2,
					'apr' : 3,
					'may' : 4,
					'jun' : 5,
					'jul' : 6,
					'aug' : 7,
					'sep' : 8,
					'oct' : 9,
					'nov' : 10,
					'dec' : 11
				}
			};

			var process = function(m) {
				var ago = (m[2] && m[2] == 'ago');
				var num = ( num = m[0] == 'last' ? -1 : 1) * ( ago ? -1 : 1);

				switch (m[0]) {
					case 'last':
					case 'next':
						switch (m[1].substring(0, 3)) {
							case 'yea':
								now.setFullYear(now.getFullYear() + num);
								break;
							case 'mon':
								now.setMonth(now.getMonth() + num);
								break;
							case 'wee':
								now.setDate(now.getDate() + (num * 7));
								break;
							case 'day':
								now.setDate(now.getDate() + num);
								break;
							case 'hou':
								now.setHours(now.getHours() + num);
								break;
							case 'min':
								now.setMinutes(now.getMinutes() + num);
								break;
							case 'sec':
								now.setSeconds(now.getSeconds() + num);
								break;
							default:
								var day;
								if( typeof ( day = __is.day[m[1].substring(0, 3)]) != 'undefined') {
									var diff = day - now.getDay();
									if(diff == 0) {
										diff = 7 * num;
									} else if(diff > 0) {
										if(m[0] == 'last') {
											diff -= 7;
										}
									} else {
										if(m[0] == 'next') {
											diff += 7;
										}
									}
									now.setDate(now.getDate() + diff);
								}
						}
						break;

					default:
						if(/\d+/.test(m[0])) {
							num *= parseInt(m[0], 10);

							switch (m[1].substring(0, 3)) {
								case 'yea':
									now.setFullYear(now.getFullYear() + num);
									break;
								case 'mon':
									now.setMonth(now.getMonth() + num);
									break;
								case 'wee':
									now.setDate(now.getDate() + (num * 7));
									break;
								case 'day':
									now.setDate(now.getDate() + num);
									break;
								case 'hou':
									now.setHours(now.getHours() + num);
									break;
								case 'min':
									now.setMinutes(now.getMinutes() + num);
									break;
								case 'sec':
									now.setSeconds(now.getSeconds() + num);
									break;
							}
						} else {
							return false;
						}
						break;
				}
				return true;
			};
			match = strTmp.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
			if(match != null) {
				if(!match[2]) {
					match[2] = '00:00:00';
				} else if(!match[3]) {
					match[2] += ':00';
				}
				s = match[1].split(/-/g);

				for(i in __is.mon) {
					if(__is.mon[i] == s[1] - 1) {
						s[1] = i;
					}
				}
				s[0] = parseInt(s[0], 10);

				s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
				return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
			}

			var regex = '([+-]?\\d+\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)' + '|(last|next)\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))' + '(\\sago)?';
			match = strTmp.match(new RegExp(regex, 'gi'));
			// Brett: seems should be case insensitive per docs, so added 'i'
			if(match == null) {
				return false;
			}
			for( i = 0; i < match.length; i++) {
				if(!process(match[i].split(' '))) {
					return false;
				}
			}
			return (now.getTime() / 1000);
		},
		/**
		 * 获取当前时间的时间戳
		 * @return {number} 时间戳
		 */
		time : function() {
			return Math.floor(new Date().getTime() / 1000);
		},
		/**
		 * 日期格式化
		 * @param {string} format 日期字符串格式
		 * @param {date} timestamp 需要格式化的日期字符串
		 * @return {string} 已格式化的字符串
		 */
		date : function(format, timestamp) {
			var that = this, jsdate, f, formatChr = /\\?([a-z])/gi, formatChrCb, _pad = function(n, c) {
				if(( n = n + '').length < c) {
					return new Array((++c) - n.length).join('0') + n;
				}
				return n;
			}, txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			formatChrCb = function(t, s) {
				return f[t] ? f[t]() : s;
			};
			f = {
				// Day
				d : function() {// Day of month w/leading 0; 01..31
					return _pad(f.j(), 2);
				},
				D : function() {// Shorthand day name; Mon...Sun
					return f.l().slice(0, 3);
				},
				j : function() {// Day of month; 1..31
					return jsdate.getDate();
				},
				l : function() {// Full day name; Monday...Sunday
					return txt_words[f.w()] + 'day';
				},
				N : function() {// ISO-8601 day of week; 1[Mon]..7[Sun]
					return f.w() || 7;
				},
				S : function() {// Ordinal suffix for day of month; st, nd, rd, th
					var j = f.j();
					return j > 4 && j < 21 ? 'th' : {1: 'st', 2: 'nd', 3: 'rd'}[j % 10] || 'th';
				},
				w : function() {// Day of week; 0[Sun]..6[Sat]
					return jsdate.getDay();
				},
				z : function() {// Day of year; 0..365
					var a = new Date(f.Y(), f.n() - 1, f.j()), b = new Date(f.Y(), 0, 1);
					return Math.round((a - b) / 864e5) + 1;
				},
				// Week
				W : function() {// ISO-8601 week number
					var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3), b = new Date(a.getFullYear(), 0, 4);
					return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
				},
				// Month
				F : function() {// Full month name; January...December
					return txt_words[6 + f.n()];
				},
				m : function() {// Month w/leading 0; 01...12
					return _pad(f.n(), 2);
				},
				M : function() {// Shorthand month name; Jan...Dec
					return f.F().slice(0, 3);
				},
				n : function() {// Month; 1...12
					return jsdate.getMonth() + 1;
				},
				t : function() {// Days in month; 28...31
					return (new Date(f.Y(), f.n(), 0)).getDate();
				},
				// Year
				L : function() {// Is leap year?; 0 or 1
					return new Date(f.Y(), 1, 29).getMonth() === 1 | 0;
				},
				o : function() {// ISO-8601 year
					var n = f.n(), W = f.W(), Y = f.Y();
					return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
				},
				Y : function() {// Full year; e.g. 1980...2010
					return jsdate.getFullYear();
				},
				y : function() {// Last two digits of year; 00...99
					return (f.Y() + "").slice(-2);
				},
				// Time
				a : function() {// am or pm
					return jsdate.getHours() > 11 ? "pm" : "am";
				},
				A : function() {// AM or PM
					return f.a().toUpperCase();
				},
				B : function() {// Swatch Internet time; 000..999
					var H = jsdate.getUTCHours() * 36e2,
					// Hours
					i = jsdate.getUTCMinutes() * 60,
					// Minutes
					s = jsdate.getUTCSeconds();
					// Seconds
					return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
				},
				g : function() {// 12-Hours; 1..12
					return f.G() % 12 || 12;
				},
				G : function() {// 24-Hours; 0..23
					return jsdate.getHours();
				},
				h : function() {// 12-Hours w/leading 0; 01..12
					return _pad(f.g(), 2);
				},
				H : function() {// 24-Hours w/leading 0; 00..23
					return _pad(f.G(), 2);
				},
				i : function() {// Minutes w/leading 0; 00..59
					return _pad(jsdate.getMinutes(), 2);
				},
				s : function() {// Seconds w/leading 0; 00..59
					return _pad(jsdate.getSeconds(), 2);
				},
				u : function() {// Microseconds; 000000-999000
					return _pad(jsdate.getMilliseconds() * 1000, 6);
				},
				// Timezone
				e : function() {// Timezone identifier; e.g. Atlantic/Azores, ...
					// The following works, but requires inclusion of the very large
					// timezone_abbreviations_list() function.
					/*              return this.date_default_timezone_get();
					 */
					throw 'Not supported (see source code of date() for timezone on how to add support)';
				},
				I : function() {// DST observed?; 0 or 1
					var a = new Date(f.Y(), 0),
					// Jan 1
					c = Date.UTC(f.Y(), 0),
					// Jan 1 UTC
					b = new Date(f.Y(), 6),
					// Jul 1
					d = Date.UTC(f.Y(), 6);
					// Jul 1 UTC
					return 0 + ((a - c) !== (b - d));
				},
				O : function() {// Difference to GMT in hour format; e.g. +0200
					var tzo = jsdate.getTimezoneOffset(), a = Math.abs(tzo);
					return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
				},
				P : function() {// Difference to GMT w/colon; e.g. +02:00
					var O = f.O();
					return (O.substr(0, 3) + ":" + O.substr(3, 2));
				},
				T : function() {
					return 'UTC';
				},
				Z : function() {// Timezone offset in seconds (-43200...50400)
					return -jsdate.getTimezoneOffset() * 60;
				},
				// Full Date/Time
				c : function() {// ISO-8601 date.
					return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
				},
				r : function() {// RFC 2822
					return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
				},
				U : function() {// Seconds since UNIX epoch
					return jsdate.getTime() / 1000 | 0;
				}
			};
			this.date = function(format, timestamp) {
				that = this;
				jsdate = (( typeof timestamp === 'undefined') ? new Date() : // Not provided
				( timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
				new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
				);
				return format.replace(formatChr, formatChrCb);
			};
			return this.date(format, timestamp);
		},
		/**
		 * 是否为空对象
		 * @param {object} 是否为空对象
		 * @return {bool} 是否为空
		 */
		isEmpty : function(obj) {
			return typeof (obj) == "undefined" || obj == 0 || obj == "";
		},
		/**
		 * 判断结束日期是否大于开始日期
		 * @param {date} start 开始日期，格式为：yyyy-mm-dd
		 * @param {date} end 结束日期，格式为：yyyy-mm-dd
		 * @return {bool} 如果大于返回1，相等返回0，小于返回-1
		 */
		dateCompare : function(start, end) {
			var arr = start.split("-");
			var starttime = new Date(arr[0], arr[1], arr[2]);
			var starttimes = starttime.getTime();

			var arrs = end.split("-");
			var lktime = new Date(arrs[0], arrs[1], arrs[2]);
			var lktimes = lktime.getTime();

			var rel = starttimes - lktimes;

			if(rel > 0) {
				return -1;
			} else if(rel < 0) {
				return 1;
			} else {
				return 0;
			}
		},
		/**
		 * 把日期格式转换成时间戳
		 * @param {date} time 需要转换的日期，格式为：yyyy-mm-dd
		 * @return {bool} 如果大于返回1，相等返回0，小于返回-1
		 */
		toUTime : function(time) {
			if(this.isEmpty(time))
				return false;
			var beginTimes = time.substring(0, 10).split('-');
			var b_daytime;
			if(time.substring(11).indexOf(":")>0)
			{
				b_daytime = time.substring(11).split(":");
			}
			else
			{
				b_daytime = [0,0,0,0];
			}
			
			var b_time = parseInt(b_daytime[0], 10) * 3600000 + parseInt(b_daytime[1]||0, 10) * 60000 + parseInt(b_daytime[2]||0, 10) * 1000;
			var beginTime = new Date(beginTimes[1] + '/' + beginTimes[2] + '/' + beginTimes[0]).getTime() + b_time;
			return Math.ceil(beginTime / 1000);
		},
		/**
		 * 判断结束时间是否大于开始时间
		 * @param {time} start 开始时间，格式为：yyyy-mm-dd H:i:s
		 * @param {time} end 结束时间，格式为：yyyy-mm-dd H:i:s
		 * @return {bool} 如果大于返回1，相等返回0，小于返回-1
		 */
		timeCompare : function(beginTime, endTime) {
			var beginTimes = beginTime.substring(0, 10).split('-');
			var endTimes = endTime.substring(0, 10).split('-');

			var b_daytime = beginTime.substring(11).split(":");
			var e_daytime = endTime.substring(11).split(":");

			var b_time = parseInt(b_daytime[0]) * 3600000 + parseInt(b_daytime[1]) * 60000 + parseInt(b_daytime[2]) * 1000;
			var e_time = parseInt(e_daytime[0]) * 3600000 + parseInt(e_daytime[1]) * 60000 + parseInt(e_daytime[2]) * 1000;
			beginTime = new Date(beginTimes[1] + '/' + beginTimes[2] + '/' + beginTimes[0]).getTime() + b_time;
			endTime = new Date(endTimes[1] + '/' + endTimes[2] + '/' + endTimes[0]).getTime() + e_time;

			var a = endTime - beginTime;

			if(a < 0) {
				return -1;
			} else if(a > 0) {
				return 1;
			} else {
				return 0;
			}
		},
		/**
		 * 判断当前时间戳是否在开始和结束时间戳内
		 * @param {time} inTime 当前时间戳
		 * @param {time} startTime 开始时间戳
		 * @param {time} endTime 结束时间戳
		 * @return {bool} 在里面返回true,不在里面返回false
		 */
		isInTimeInterval : function(inTime, startTime, endTime) {
			var i_s = this.timeCompare(startTime, inTime);
			var i_e = this.timeCompare(inTime, endTime);

			return i_s >= 0 && i_e >= 0;
		},
		/**
		 * xml数据转化成json数据
		 * @param {xml} xml 当前时间戳
		 * @param {bool} extended 
		 * @return {object} 返回json数据
		 */
		xml2json : function(xml, extended) {
			if(!xml)
				return {};

			function parseXML(node, simple) {
				if(!node)
					return null;
				var txt = '', obj = null, att = null;
				var nt = node.nodeType, nn = jsVar(node.localName || node.nodeName);
				var nv = node.text || node.nodeValue || '';
				if(node.childNodes) {
					if(node.childNodes.length > 0) {
						$.each(node.childNodes, function(n, cn) {
							var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
							var cnv = cn.text || cn.nodeValue || '';
							if(cnt == 8) {
								return;
							} else if(cnt == 3 || cnt == 4 || !cnn) {
								if(cnv.match(/^\s+$/)) {
									return;
								};
								txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
							} else {
								obj = obj || {};
								if(obj[cnn]) {

									if(!obj[cnn].length)
										obj[cnn] = myArr(obj[cnn]);
									obj[cnn] = myArr(obj[cnn]);
									obj[cnn][obj[cnn].length] = parseXML(cn, true /* simple */);
									obj[cnn].length = obj[cnn].length;
								} else {
									obj[cnn] = parseXML(cn);
								};
							};
						});
					}; // node.childNodes.length>0
				}; // node.childNodes
				if(node.attributes) {
					if(node.attributes.length > 0) {
						att = {};
						obj = obj || {};
						$.each(node.attributes, function(a, at) {
							var atn = jsVar(at.name), atv = at.value;
							att[atn] = atv;
							if(obj[atn]) {

								obj[cnn] = myArr(obj[cnn]);

								obj[atn][obj[atn].length] = atv;
								obj[atn].length = obj[atn].length;
							} else {
								obj[atn] = atv;
							};
						});
					};
				};
				if(obj) {
					obj = $.extend((txt != '' ? new String(txt) : {}), /* {text:txt}, */
					obj || {}
					);
					txt = (obj.text) ? ( typeof (obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
					if(txt)
						obj.text = txt;
					txt = '';
				};
				var out = obj || txt;
				if(extended) {
					if(txt)
						out = {};
					txt = out.text || txt || '';
					if(txt)
						out.text = txt;
					if(!simple)
						out = myArr(out);
				};
				return out;
			};
			var jsVar = function(s) {
				return String(s || '').replace(/-/g, "_");
			};
			function isNum(s) {
				var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/;
				return ( typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
			};
			var myArr = function(o) {
				if(!$.isArray(o))
					o = [o];
				o.length = o.length;

				return o;
			};
			if( typeof xml == 'string')
				xml = $.text2xml(xml);

			if(!xml.nodeType)
				return;
			if(xml.nodeType == 3 || xml.nodeType == 4)
				return xml.nodeValue;

			var root = (xml.nodeType == 9) ? xml.documentElement : xml;

			var out = parseXML(root, true /* simple */);
			xml = null;
			root = null;
			return out;
		},
		/**
		 * 文本数据数据转化成xml数据
		 * @param {string} str 文本数据
		 * @return {object} 返回xml数据
		 */
		text2xml : function(str) {
			var out;
			try {
				var xml = ($.browser.msie) ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
				xml.async = false;
			} catch (e) {
				throw new Error("XML Parser could not be instantiated");
			};
			try {
				if($.browser.msie)
					out = (xml.loadXML(str)) ? xml : false;
				else
					out = xml.parseFromString(str, "text/xml");
			} catch (e) {
				throw new Error("Error parsing XML string");
			};
			return out;
		},
		/**
		 * 文本数据数据转化成xml数据
		 * @param {object} a 需要参数化的数组或对象
		 * @param {bool} isescape 是否需要编码value值
		 * @demo 待添加
		 * @return {string} 返回url的参数格式，eq、a=xx&b=xx
		 */
		param:function(a,isescape) {
			isescape = isescape==true?true:false;
			var s = [ ];
			function add( key, value ){
				if(isescape){
					s[ s.length ] = escape(key) + '=' + escape(value);
				}else{
					s[ s.length ] = key + '=' + value;
				}
			};
			if ( jQuery.isArray(a) || a.jquery )
				jQuery.each( a, function(){
					add( this.name, this.value );
				});
			else
				for ( var j in a )
					if ( jQuery.isArray(a[j]) )
						jQuery.each( a[j], function(){
							add( j, this );
						});
					else
						add( j, jQuery.isFunction(a[j]) ? a[j]() : a[j] );
			return s.join("&").replace(/%20/g, "+");
		}
	});
	
	/**
	 * @author haryli 
	 * @version 2.0
	 * @date 2012-12-15 
	 * @class Base.jQuery.fn  
	 * <p>
	 * 该js库是商城的基础库，提供商城最基础的方法调用，基于jQuery插件；<br/>
	 * 方法集主要包括：jQuery的函数库扩展，$.fn的扩展<br/>
	 * </p>
	  <pre><code>
	 调用方法：
	 $("#ads").ADRoll({...});
	 $(".time").showLTM({...});
	 ...
	  </code></pre>
	 */
	
	/**
	 * flash滚动ui插件扩展
	 * @param {object} settings flash参数的设定
	 * @demo 待添加
	 * @return {object}  max
	 */
	$.fn.ADRoll = function(settings) {
		settings = jQuery.extend({
			speed : "normal",
			num : 4,
			timer : 1000,
			direction : "top",
			imgHeight : ""
		}, settings);
		return this.each(function() {
			$.fn.ADRoll.scllor($(this), settings);
		});
	};
	$.fn.ADRoll.scllor = function($this, settings) {
		var index = 0;
		var li = $(".new_banner_list li");
		var showBox = $(".new_banner_box");
		var con_prv = $('.new_banner_list_prv');
		var con_next = $('.new_banner_list_next');
		li.hover(function() {
			if (intervalTime) {
				clearInterval(intervalTime);
			}
			index = li.index(this);
			intervalTime = setTimeout(function() {
				ShowAD(index);
			}, 100);
		}, function() {
			clearInterval(intervalTime);
			intervalTime = setInterval(function() {
				ShowAD(index);
				index++;
				if (index == settings.num) {
					index = 0;
				}
			}, settings.timer)
		});
		con_prv.click(function() {
			clearInterval(intervalTime);
			if (index == 0)
				index = settings.num - 1;
			else
				index--;
			ShowAD(index);
		});
		con_next.click(function() {
			clearInterval(intervalTime);
			ShowAD(index);
			index++;
			if (index == settings.num) {
				index = 0;
			}
		});
		showBox.hover(function() {
			if (intervalTime) {
				clearInterval(intervalTime);
			}
		}, function() {
			clearInterval(intervalTime);
			intervalTime = setInterval(function() {
				ShowAD(index);
				index++;
				if (index == settings.num) {
					index = 0;
				}
			}, settings.timer);
		});
		var intervalTime = setInterval(function() {
			ShowAD(index);
			index++;
			if (index == settings.num) {
				index = 0;
			}
		}, settings.timer);
		var ShowAD = function(i) {
			showBox.animate({
				"top" : -i * settings.imgHeight
			}, settings.speed);
			li.eq(i).addClass("focus").siblings().removeClass("focus");
		};
	};
	//fn extend
	$.fn.extend({
		/**
		 * 剩余时间的动态显示，ui扩展
		 * @param {object} option 扩展参数，默认：
		 * <pre><code>{
		 * 	tpl:'<!--剩余<span class="font_red_b">{$day}</span>天<span class="font_red_b">{$hour}</span>时<span class="font_red_b">{$minite}</span>分<span class="font_red_b">{$second}</span>秒-->'
		 * }</code></pre>
		 * @demo 待添加
		 * @return {object}  max
		 */
		showLTM:function(option){
			var default_option = {
					tpl:'<!--剩余<span class="font_red_b">{$day}</span>天<span class="font_red_b">{$hour}</span>时<span class="font_red_b">{$minite}</span>分<span class="font_red_b">{$second}</span>秒-->',
					un_start_msg:'活动即将开始',
					has_end_msg:'活动已结束',
					endCallback:$.noop
			};
			var option = $.extend(default_option,option);
			//初始化函数
			var init = function($obj){
				var msg = "";
				var start_date = $obj.attr("start");
				var end_date = $obj.attr("end");
				var now_date = $.date("Y-m-d H:i:s");
				var is_in_time = false;
				var end_time = $.toUTime(end_date);
				
				if(typeof(JSON_sys_time)!="undefined"){
					now_date = JSON_sys_time.sMsg;
				}
				if($.toUTime(now_date)<$.toUTime(start_date)){
					msg = option.un_start_msg;
				}
				if($.toUTime(now_date)>=$.toUTime(start_date)&&$.toUTime(now_date)<=$.toUTime(end_date)){
					var left_time = $.showTimeLeft(now_date,end_date);
					var data = {day:left_time[3],hour:left_time[2],minite:left_time[1],second:left_time[0]};
					msg = $.fillItemTpl(option.tpl,0,data);
				}
				if($.toUTime(now_date)>$.toUTime(end_date)){
					msg = option.has_end_msg;
					$.isFunction(option.endCallback)&&option.endCallback();
				}
				$obj.html(msg);
			};
			var $this = $(this);
			$.each($(this),function(){
				init($(this));
			});
			window.cur_time = $.time();
			if(typeof(JSON_sys_time)!="undefined"){
				window.cur_time = $.toUTime(JSON_sys_time.sMsg);
			}
			var msg = "";
			clearInterval(window.run_time);
			window.run_time = setInterval(function(){
				window.cur_time++;
				$.each($this,function(){
					var end_date = $(this).attr("end");
					var end_time = $.toUTime(end_date);
					var start_date = $(this).attr("start");
					var start_time = $.toUTime(start_date);
					if(window.cur_time>=end_time){
						clearInterval(run_time);
						msg = option.has_end_msg;
						$.isFunction(option.endCallback)&&option.endCallback();
					}else if(window.cur_time<start_time){
						msg = option.un_start_msg;
					}else{
						var left_time = $.showTimeLeft($.date("Y-m-d H:i:s",window.cur_time),end_date);
						var data = {day:left_time[3],hour:left_time[2],minite:left_time[1],second:left_time[0]};
						msg = $.fillItemTpl(option.tpl,0,data);
					}
					$(this).html(msg);
				});
			},1000);
		},
		showGameList:function(option){
			var default_set = {
				tpl:'<li><h4>{$sType}：</h4><p class="p_select_list">{$lis}</p></li>',
				itemTpl:'<span><a href="javascript:;" val="{$sBzCode}" name="{$sName}">{$sName}</a>{$split_info}</span>'
			};
			var getOutTpl = function(id,name){ return '<input type="hidden" name="'+name+'" id="'+id+'"/><a href="javascript:;" class="btn_select_ico" id="btn_'+id+'_select_ico"></a>\
						<iframe  width=0 height=0 class="div_select_list_iframe" id="iframe_'+id+'" />\
						<div id="select_'+id+'" class="div_select_list" style="*left:1px;">\
	                        <span class="sp_ico_up"></span>\
	                        <ul id="list_'+id+'"></ul>\
	                    </div>';};
			option = $.extend({},default_set,option);
			var dealGameInfo = function(callback){
				$.each(BigMall_game,function(k,game){
					var lis = "";
					$.each(game.games,function(k,v){
						v.split_info = (k==(game.games.length-1))?"":"|";
						lis+= $.fillItemTpl(option.itemTpl,k,v);
					});
					game.lis = lis;
				});
				if($.isFunction(callback)){
					callback(BigMall_game);
				}
			};
			var init_tpl = function(callback){
				var new_arr = {};
				var url = "http://daoju.qq.com/time/big_mall/js/game_file.js";
				if(typeof(BigMall_game)!="undefined"){
					dealGameInfo(callback);
				}else{
					$.getScript(url,function(){
						if(typeof(BigMall_game)!="undefined")
						{
							dealGameInfo(callback);
						}
					});
				}
			};
			$(this).each(function(){
				var __id = $(this).attr('id');
				var __name = $(this).attr('name');
				$(this).removeClass().addClass("slelect_txtbox").wrap("<div class='tb_wrap' style='display:inline-block;position:relative;width:146px;_zoom:1;*display:inline;'></div>");
				$("#"+__id).attr({"name":"tb_"+__name,"id":"tb_"+__id,"readonly":true}).after(getOutTpl(__id,__name));
				init_tpl(function(){
					$.fillListTpl("list_"+__id, BigMall_game, function(){}, true,option.tpl);
					$("body").unbind().click(function(e){
						if($(e.target).is(":not(.slelect_txtbox,.btn_select_ico)")){
							$(".div_select_list_iframe").hide();
							$(".div_select_list").hide();
						}
					});
					$("#tb_"+__id+",#btn_"+__id+"_select_ico").unbind().click(function(){
						if($("#select_"+__id).is(":visible")){
							$("#select_"+__id).hide();
							$("#iframe_"+__id).hide();
						}else{
							$(".div_select_list").hide();
							$(".div_select_list_iframe").hide();
							$("#select_"+__id).show();
							$("#iframe_"+__id).show();
						}
					});
					$("#list_"+__id+" a").unbind().click(function(){
						$("#list_"+__id+" a").removeAttr("style");
						var val = $(this).attr("val");
						var name = $(this).attr("name");
						$("#tb_"+__id).val(name);
						$("#"+__id).val(val);
						$(this).css("color","#DE1407");
						$("#select_"+__id).hide();
					});
				});
			});
		},
		carousel : function(option) {
			var opt = {
				url:"",
				flag:"",
				warpId : "carouselContent",
				showNum : 6,
				loopTime : 1200,
				jsonpVar : "JSON_AWARDS",
				callBack : $.noop
			};
			var option = $.extend(opt, option);
			var $this = $(this),warpId = $(this).attr("id");
			
			var scrollAwards = function(option) {
				var li_first = $this.children(":first");
				var li_height = li_first.outerHeight();
				var li_width = li_first.outerWidth();
				window.last_items = option.jsonpVar.slice(option.showNum);
				$this.css({
					height : li_height * option.showNum + "px",
					overflow : "hidden",
					width : li_width + "px"
				});

				//定时跑
				var scoll_awards = setInterval(function() {
					if(last_items.length > 0) {
						var shift_one = last_items.shift();
						var index_num = $("#" + option.warpId).children().length;
						var li_html = $.fillItemTpl($.tpl[warpId], index_num, shift_one);

						$(li_html).appendTo($this);
						$this.children(":first").animate({
							marginTop : -li_height
						}, 1000, function() {
							$this.children(":first").remove();
						});
						
					} else {
						clearInterval(scoll_awards);
						scrollAwards(option);
					}
				}, option.loopTime);

			}
			//initData define
			var initData = function(option) {
				if(option.url=="")
				{
					option.url = "http://daoju.qq.com/time/market/js/"+option.flag+"/CarouselShow.js";
				}
				
				$.getScript(option.url+"?" + Math.random(), function() {
					
					option.jsonpVar = eval(option.jsonpVar);
					
					if( typeof (option.jsonpVar) === "undefined" || option.jsonpVar.length <= 0) {
						return false;
					}
					$.fillListTpl(warpId, option.jsonpVar.slice(0, option.showNum), function() {
						scrollAwards(option);
						option.callBack(option);
					}, true);
				});
			}
			//初始化数据
			$(this).each(function(){
				initData(option);
			});
		}
	});
}(jQuery);
(function( jQuery, undefined ){
	var oldManip = jQuery.fn.domManip, tmplItmAtt = "_tmplitem", htmlExpr = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
		newTmplItems = {}, wrappedItems = {}, appendToTmplItems, topTmplItem = { key: 0, data: {} }, itemKey = 0, cloneIndex = 0, stack = [];

	function newTmplItem( options, parentItem, fn, data ) {
		// Returns a template item data structure for a new rendered instance of a template (a 'template item').
		// The content field is a hierarchical array of strings and nested items (to be
		// removed and replaced by nodes field of dom elements, once inserted in DOM).
		var newItem = {
			data: data || (data === 0 || data === false) ? data : (parentItem ? parentItem.data : {}),
			_wrap: parentItem ? parentItem._wrap : null,
			tmpl: null,
			parent: parentItem || null,
			nodes: [],
			calls: tiCalls,
			nest: tiNest,
			wrap: tiWrap,
			html: tiHtml,
			update: tiUpdate
		};
		if ( options ) {
			jQuery.extend( newItem, options, { nodes: [], parent: parentItem });
		}
		if ( fn ) {
			// Build the hierarchical content to be used during insertion into DOM
			newItem.tmpl = fn;
			newItem._ctnt = newItem._ctnt || newItem.tmpl( jQuery, newItem );
			newItem.key = ++itemKey;
			// Keep track of new template item, until it is stored as jQuery Data on DOM element
			(stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
		}
		return newItem;
	}

	// Override appendTo etc., in order to provide support for targeting multiple elements. (This code would disappear if integrated in jquery core).
	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var ret = [], insert = jQuery( selector ), elems, i, l, tmplItems,
				parent = this.length === 1 && this[0].parentNode;

			appendToTmplItems = newTmplItems || {};
			if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
				insert[ original ]( this[0] );
				ret = this;
			} else {
				for ( i = 0, l = insert.length; i < l; i++ ) {
					cloneIndex = i;
					elems = (i > 0 ? this.clone(true) : this).get();
					jQuery( insert[i] )[ original ]( elems );
					ret = ret.concat( elems );
				}
				cloneIndex = 0;
				ret = this.pushStack( ret, name, insert.selector );
			}
			tmplItems = appendToTmplItems;
			appendToTmplItems = null;
			jQuery.tmpl.complete( tmplItems );
			return ret;
		};
	});

	jQuery.fn.extend({
		// Use first wrapped element as template markup.
		// Return wrapped set of template items, obtained by rendering template against data.
		tmpl: function( data, options, parentItem ) {
			return jQuery.tmpl( this[0], data, options, parentItem );
		},

		// Find which rendered template item the first wrapped DOM element belongs to
		tmplItem: function() {
			return jQuery.tmplItem( this[0] );
		},

		// Consider the first wrapped element as a template declaration, and get the compiled template or store it as a named template.
		template: function( name ) {
			return jQuery.template( name, this[0] );
		},

		domManip: function( args, table, callback, options ) {
			if ( args[0] && jQuery.isArray( args[0] )) {
				var dmArgs = jQuery.makeArray( arguments ), elems = args[0], elemsLength = elems.length, i = 0, tmplItem;
				while ( i < elemsLength && !(tmplItem = jQuery.data( elems[i++], "tmplItem" ))) {}
				if ( tmplItem && cloneIndex ) {
					dmArgs[2] = function( fragClone ) {
						// Handler called by oldManip when rendered template has been inserted into DOM.
						jQuery.tmpl.afterManip( this, fragClone, callback );
					};
				}
				oldManip.apply( this, dmArgs );
			} else {
				oldManip.apply( this, arguments );
			}
			cloneIndex = 0;
			if ( !appendToTmplItems ) {
				jQuery.tmpl.complete( newTmplItems );
			}
			return this;
		}
	});

	jQuery.extend({
		// Return wrapped set of template items, obtained by rendering template against data.
		tmpl: function( tmpl, data, options, parentItem ) {
			var ret, topLevel = !parentItem;
			if ( topLevel ) {
				// This is a top-level tmpl call (not from a nested template using {{tmpl}})
				parentItem = topTmplItem;
				tmpl = jQuery.template[tmpl] || jQuery.template( null, tmpl );
				wrappedItems = {}; // Any wrapped items will be rebuilt, since this is top level
			} else if ( !tmpl ) {
				// The template item is already associated with DOM - this is a refresh.
				// Re-evaluate rendered template for the parentItem
				tmpl = parentItem.tmpl;
				newTmplItems[parentItem.key] = parentItem;
				parentItem.nodes = [];
				if ( parentItem.wrapped ) {
					updateWrapped( parentItem, parentItem.wrapped );
				}
				// Rebuild, without creating a new template item
				return jQuery( build( parentItem, null, parentItem.tmpl( jQuery, parentItem ) ));
			}
			if ( !tmpl ) {
				return []; // Could throw...
			}
			if ( typeof data === "function" ) {
				data = data.call( parentItem || {} );
			}
			if ( options && options.wrapped ) {
				updateWrapped( options, options.wrapped );
			}
			ret = jQuery.isArray( data ) ?
				jQuery.map( data, function( dataItem ) {
					return dataItem ? newTmplItem( options, parentItem, tmpl, dataItem ) : null;
				}) :
				[ newTmplItem( options, parentItem, tmpl, data ) ];
			return topLevel ? jQuery( build( parentItem, null, ret ) ) : ret;
		},

		// Return rendered template item for an element.
		tmplItem: function( elem ) {
			var tmplItem;
			if ( elem instanceof jQuery ) {
				elem = elem[0];
			}
			while ( elem && elem.nodeType === 1 && !(tmplItem = jQuery.data( elem, "tmplItem" )) && (elem = elem.parentNode) ) {}
			return tmplItem || topTmplItem;
		},

		// Set:
		// Use $.template( name, tmpl ) to cache a named template,
		// where tmpl is a template string, a script element or a jQuery instance wrapping a script element, etc.
		// Use $( "selector" ).template( name ) to provide access by name to a script block template declaration.

		// Get:
		// Use $.template( name ) to access a cached template.
		// Also $( selectorToScriptBlock ).template(), or $.template( null, templateString )
		// will return the compiled template, without adding a name reference.
		// If templateString includes at least one HTML tag, $.template( templateString ) is equivalent
		// to $.template( null, templateString )
		template: function( name, tmpl ) {
			if (tmpl) {
				// Compile template and associate with name
				if ( typeof tmpl === "string" ) {
					// This is an HTML string being passed directly in.
					tmpl = buildTmplFn( tmpl );
				} else if ( tmpl instanceof jQuery ) {
					tmpl = tmpl[0] || {};
				}
				if ( tmpl.nodeType ) {
					// If this is a template block, use cached copy, or generate tmpl function and cache.
					tmpl = jQuery.data( tmpl, "tmpl" ) || jQuery.data( tmpl, "tmpl", buildTmplFn( tmpl.innerHTML ));
					// Issue: In IE, if the container element is not a script block, the innerHTML will remove quotes from attribute values whenever the value does not include white space.
					// This means that foo="${x}" will not work if the value of x includes white space: foo="${x}" -> foo=value of x.
					// To correct this, include space in tag: foo="${ x }" -> foo="value of x"
				}
				return typeof name === "string" ? (jQuery.template[name] = tmpl) : tmpl;
			}
			// Return named compiled template
			return name ? (typeof name !== "string" ? jQuery.template( null, name ):
				(jQuery.template[name] ||
					// If not in map, and not containing at least on HTML tag, treat as a selector.
					// (If integrated with core, use quickExpr.exec)
					jQuery.template( null, htmlExpr.test( name ) ? name : jQuery( name )))) : null;
		},

		encode: function( text ) {
			// Do HTML encoding replacing < > & and ' and " by corresponding entities.
			return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
		}
	});

	jQuery.extend( jQuery.tmpl, {
		tag: {
			"tmpl": {
				_default: { $2: "null" },
				open: "if($notnull_1){__=__.concat($item.nest($1,$2));}"
				// tmpl target parameter can be of type function, so use $1, not $1a (so not auto detection of functions)
				// This means that {{tmpl foo}} treats foo as a template (which IS a function).
				// Explicit parens can be used if foo is a function that returns a template: {{tmpl foo()}}.
			},
			"wrap": {
				_default: { $2: "null" },
				open: "$item.calls(__,$1,$2);__=[];",
				close: "call=$item.calls();__=call._.concat($item.wrap(call,__));"
			},
			"each": {
				_default: { $2: "$index, $value" },
				open: "if($notnull_1){$.each($1a,function($2){with(this){",
				close: "}});}"
			},
			"if": {
				open: "if(($notnull_1) && $1a){",
				close: "}"
			},
			"else": {
				_default: { $1: "true" },
				open: "}else if(($notnull_1) && $1a){"
			},
			"html": {
				// Unecoded expression evaluation.
				open: "if($notnull_1){__.push($1a);}"
			},
			"=": {
				// Encoded expression evaluation. Abbreviated form is ${}.
				_default: { $1: "$data" },
				open: "if($notnull_1){__.push($.encode($1a));}"
			},
			"!": {
				// Comment tag. Skipped by parser
				open: ""
			}
		},

		// This stub can be overridden, e.g. in jquery.tmplPlus for providing rendered events
		complete: function( items ) {
			newTmplItems = {};
		},

		// Call this from code which overrides domManip, or equivalent
		// Manage cloning/storing template items etc.
		afterManip: function afterManip( elem, fragClone, callback ) {
			// Provides cloned fragment ready for fixup prior to and after insertion into DOM
			var content = fragClone.nodeType === 11 ?
				jQuery.makeArray(fragClone.childNodes) :
				fragClone.nodeType === 1 ? [fragClone] : [];

			// Return fragment to original caller (e.g. append) for DOM insertion
			callback.call( elem, fragClone );

			// Fragment has been inserted:- Add inserted nodes to tmplItem data structure. Replace inserted element annotations by jQuery.data.
			storeTmplItems( content );
			cloneIndex++;
		}
	});

	//========================== Private helper functions, used by code above ==========================

	function build( tmplItem, nested, content ) {
		// Convert hierarchical content into flat string array
		// and finally return array of fragments ready for DOM insertion
		var frag, ret = content ? jQuery.map( content, function( item ) {
			return (typeof item === "string") ?
				// Insert template item annotations, to be converted to jQuery.data( "tmplItem" ) when elems are inserted into DOM.
				(tmplItem.key ? item.replace( /(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + tmplItmAtt + "=\"" + tmplItem.key + "\" $2" ) : item) :
				// This is a child template item. Build nested template.
				build( item, tmplItem, item._ctnt );
		}) :
		// If content is not defined, insert tmplItem directly. Not a template item. May be a string, or a string array, e.g. from {{html $item.html()}}.
		tmplItem;
		if ( nested ) {
			return ret;
		}

		// top-level template
		ret = ret.join("");

		// Support templates which have initial or final text nodes, or consist only of text
		// Also support HTML entities within the HTML markup.
		ret.replace( /^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function( all, before, middle, after) {
			frag = jQuery( middle ).get();

			storeTmplItems( frag );
			if ( before ) {
				frag = unencode( before ).concat(frag);
			}
			if ( after ) {
				frag = frag.concat(unencode( after ));
			}
		});
		return frag ? frag : unencode( ret );
	}

	function unencode( text ) {
		// Use createElement, since createTextNode will not render HTML entities correctly
		var el = document.createElement( "div" );
		el.innerHTML = text;
		return jQuery.makeArray(el.childNodes);
	}

	// Generate a reusable function that will serve to render a template against data
	function buildTmplFn( markup ) {
		return new Function("jQuery","$item",
			// Use the variable __ to hold a string array while building the compiled template. (See https://github.com/jquery/jquery-tmpl/issues#issue/10).
			"var $=jQuery,call,__=[],$data=$item.data;" +

			// Introduce the data as local variables using with(){}
			"with($data){__.push('" +

			// Convert the template into pure JavaScript
			jQuery.trim(markup)
				.replace( /([\\'])/g, "\\$1" )
				.replace( /[\r\t\n]/g, " " )
				.replace( /\$\{([^\}]*)\}/g, "{{= $1}}" )
				.replace( /\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,
				function( all, slash, type, fnargs, target, parens, args ) {
					var tag = jQuery.tmpl.tag[ type ], def, expr, exprAutoFnDetect;
					if ( !tag ) {
						throw "Unknown template tag: " + type;
					}
					def = tag._default || [];
					if ( parens && !/\w$/.test(target)) {
						target += parens;
						parens = "";
					}
					if ( target ) {
						target = unescape( target );
						args = args ? ("," + unescape( args ) + ")") : (parens ? ")" : "");
						// Support for target being things like a.toLowerCase();
						// In that case don't call with template item as 'this' pointer. Just evaluate...
						expr = parens ? (target.indexOf(".") > -1 ? target + unescape( parens ) : ("(" + target + ").call($item" + args)) : target;
						exprAutoFnDetect = parens ? expr : "(typeof(" + target + ")==='function'?(" + target + ").call($item):(" + target + "))";
					} else {
						exprAutoFnDetect = expr = def.$1 || "null";
					}
					fnargs = unescape( fnargs );
					return "');" +
						tag[ slash ? "close" : "open" ]
							.split( "$notnull_1" ).join( target ? "typeof(" + target + ")!=='undefined' && (" + target + ")!=null" : "true" )
							.split( "$1a" ).join( exprAutoFnDetect )
							.split( "$1" ).join( expr )
							.split( "$2" ).join( fnargs || def.$2 || "" ) +
						"__.push('";
				}) +
			"');}return __;"
		);
	}
	function updateWrapped( options, wrapped ) {
		// Build the wrapped content.
		options._wrap = build( options, true,
			// Suport imperative scenario in which options.wrapped can be set to a selector or an HTML string.
			jQuery.isArray( wrapped ) ? wrapped : [htmlExpr.test( wrapped ) ? wrapped : jQuery( wrapped ).html()]
		).join("");
	}

	function unescape( args ) {
		return args ? args.replace( /\\'/g, "'").replace(/\\\\/g, "\\" ) : null;
	}
	function outerHtml( elem ) {
		var div = document.createElement("div");
		div.appendChild( elem.cloneNode(true) );
		return div.innerHTML;
	}

	// Store template items in jQuery.data(), ensuring a unique tmplItem data data structure for each rendered template instance.
	function storeTmplItems( content ) {
		var keySuffix = "_" + cloneIndex, elem, elems, newClonedItems = {}, i, l, m;
		for ( i = 0, l = content.length; i < l; i++ ) {
			if ( (elem = content[i]).nodeType !== 1 ) {
				continue;
			}
			elems = elem.getElementsByTagName("*");
			for ( m = elems.length - 1; m >= 0; m-- ) {
				processItemKey( elems[m] );
			}
			processItemKey( elem );
		}
		function processItemKey( el ) {
			var pntKey, pntNode = el, pntItem, tmplItem, key;
			// Ensure that each rendered template inserted into the DOM has its own template item,
			if ( (key = el.getAttribute( tmplItmAtt ))) {
				while ( pntNode.parentNode && (pntNode = pntNode.parentNode).nodeType === 1 && !(pntKey = pntNode.getAttribute( tmplItmAtt ))) { }
				if ( pntKey !== key ) {
					// The next ancestor with a _tmplitem expando is on a different key than this one.
					// So this is a top-level element within this template item
					// Set pntNode to the key of the parentNode, or to 0 if pntNode.parentNode is null, or pntNode is a fragment.
					pntNode = pntNode.parentNode ? (pntNode.nodeType === 11 ? 0 : (pntNode.getAttribute( tmplItmAtt ) || 0)) : 0;
					if ( !(tmplItem = newTmplItems[key]) ) {
						// The item is for wrapped content, and was copied from the temporary parent wrappedItem.
						tmplItem = wrappedItems[key];
						tmplItem = newTmplItem( tmplItem, newTmplItems[pntNode]||wrappedItems[pntNode] );
						tmplItem.key = ++itemKey;
						newTmplItems[itemKey] = tmplItem;
					}
					if ( cloneIndex ) {
						cloneTmplItem( key );
					}
				}
				el.removeAttribute( tmplItmAtt );
			} else if ( cloneIndex && (tmplItem = jQuery.data( el, "tmplItem" )) ) {
				// This was a rendered element, cloned during append or appendTo etc.
				// TmplItem stored in jQuery data has already been cloned in cloneCopyEvent. We must replace it with a fresh cloned tmplItem.
				cloneTmplItem( tmplItem.key );
				newTmplItems[tmplItem.key] = tmplItem;
				pntNode = jQuery.data( el.parentNode, "tmplItem" );
				pntNode = pntNode ? pntNode.key : 0;
			}
			if ( tmplItem ) {
				pntItem = tmplItem;
				// Find the template item of the parent element.
				// (Using !=, not !==, since pntItem.key is number, and pntNode may be a string)
				while ( pntItem && pntItem.key != pntNode ) {
					// Add this element as a top-level node for this rendered template item, as well as for any
					// ancestor items between this item and the item of its parent element
					pntItem.nodes.push( el );
					pntItem = pntItem.parent;
				}
				// Delete content built during rendering - reduce API surface area and memory use, and avoid exposing of stale data after rendering...
				delete tmplItem._ctnt;
				delete tmplItem._wrap;
				// Store template item as jQuery data on the element
				jQuery.data( el, "tmplItem", tmplItem );
			}
			function cloneTmplItem( key ) {
				key = key + keySuffix;
				tmplItem = newClonedItems[key] =
					(newClonedItems[key] || newTmplItem( tmplItem, newTmplItems[tmplItem.parent.key + keySuffix] || tmplItem.parent ));
			}
		}
	}

	//---- Helper functions for template item ----

	function tiCalls( content, tmpl, data, options ) {
		if ( !content ) {
			return stack.pop();
		}
		stack.push({ _: content, tmpl: tmpl, item:this, data: data, options: options });
	}

	function tiNest( tmpl, data, options ) {
		// nested template, using {{tmpl}} tag
		return jQuery.tmpl( jQuery.template( tmpl ), data, options, this );
	}

	function tiWrap( call, wrapped ) {
		// nested template, using {{wrap}} tag
		var options = call.options || {};
		options.wrapped = wrapped;
		// Apply the template, which may incorporate wrapped content,
		return jQuery.tmpl( jQuery.template( call.tmpl ), call.data, options, call.item );
	}

	function tiHtml( filter, textOnly ) {
		var wrapped = this._wrap;
		return jQuery.map(
			jQuery( jQuery.isArray( wrapped ) ? wrapped.join("") : wrapped ).filter( filter || "*" ),
			function(e) {
				return textOnly ?
					e.innerText || e.textContent :
					e.outerHTML || outerHtml(e);
			});
	}

	function tiUpdate() {
		var coll = this.nodes;
		jQuery.tmpl( null, null, null, this).insertBefore( coll[0] );
		jQuery( coll ).remove();
	}
})( jQuery );
//var cur_time = $.time();
//if(cur_time>1366992000&&cur_time<1367078400){
//	if($.browser.msie){
//		var gray_css =  "filter: grayscale(100%);\
//			filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);";
//		$("html").attr("style",gray_css);
//	}else{
//		var gray_css =  "-webkit-filter: grayscale(100%);" +
//		"-moz-filter: grayscale(100%);" +
//		"-ms-filter: grayscale(100%);" +
//		"-o-filter: grayscale(100%);" +
//		"filter: grayscale(100%);"+
//		"filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);" +
//		"filter:gray;" +
//		"filter: url(\"data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale\")";
//		$("html").attr("style",gray_css);
//	}
//}

window.getUin = function(){
	var p_uin = $.cookie("uin")||$.cookie("pt2gguin")||"";
	p_uin = parseInt(p_uin.substr(1),10);
	var __qq = p_uin||$.cookie("o_cookie")||$.trim($.cookie("ptui_loginuin"))||"";
	return __qq;
}
/**
 * 道聚城数据上报
 * @desc 数据上报方法
 * @param {string} logType 日志类型
 * @param {string} pageType 页面类型
 * @param {number} iSeqId 道具iSeqId
 * @param {string} sCode 道具sCode
 * @return {null}
 * <p>
 * 	   日志类型：用以区分各种类型的日志，通过编号id区分，具体编号如下：
       1：用户浏览的数据信息日志-道聚城首页数据
       2：用户浏览的数据信息日志-道聚城搜索数据
       3：用户浏览的数据信息日志-分商城首页浏览信息数据
       4、用户浏览的数据信息日志-分商城列表页浏览信息数据
       5、用户浏览的数据信息日志-商品详情页浏览信息数据
       6：下单的信息（放到购物车）
       7：交易购买日志
       8：搜索行为日志
       9：商品池信息
       
       页面类型：用以区分道聚城不同类型的页面，
       1：道聚城首页，对应url:daoju.qq.com
       2：道聚城搜索页，对应url:daoju.qq.com/search.shtml
       3：分商城首页，对应url:daoju.qq.com/业务（也称为类目）
       4：分商城列表页，对应url:daoju.qq.com/业务/list/xxxx
       5：分商城详情页，对应url:daoju.qq.com/业务/item/xxxx
       6：分商城购物车页，对应url:daoju.qq.com/业务/cart.shtml

 * </p>
 */	 
window.djcssPing = function(logType,pageType,iSeqId,sCode,key,flag,algorithm){
	var __qq = getUin();
	var __refer = document.referrer;
	var __sourPos = $.cookie("posId");
	var __sourItemId = $.cookie("itemId");
	var __time = $.date("Y-m-d H:i:s");
	var __flag = typeof(globalvar)!="undefined"?globalvar.flag:"";
	var __cururl = escape(location.href);
	var a_css = [];
	if(__refer.length>800)__refer = __refer.split("?")[0];
	__refer = escape(__refer.replace(/\s/g,""));
	if(!typeof(window.posId)){
		window.posId = "";
	}
	if(!typeof(window.deRecIds)){
		window.deRecIds = "";
	}
	if(__sourPos){
		window.posId = __sourPos;
	}
	if(__refer==""){
		window.posId = "";
	}
	if(flag){
		__flag = flag;
	}
	switch(logType){
		case 8:
			a_css = [logType,__qq,__time,key,__flag,__cururl];
			break;
		case 10:
			a_css = [logType,__qq,__time,__flag,51,algorithm||1000,iSeqId,window.deRecIds];
			break;
		case 11:
			a_css = [logType,__qq,__time,__flag,(window.posId||51),algorithm||1000,__sourItemId,iSeqId];
			$.cookie("itemId",null);
			break;
		default:
			a_css = [logType,__qq,__time,iSeqId,sCode.split("|").join(","),__flag,__cururl,pageType,__refer,window.posId];
			break;
	}
	
	var ping_str = a_css.join("|");
	var url = "http://apps.game.qq.com/cgi-bin/daoju/report/report.cgi?flag="+__flag+"&str="+ping_str;
	$.cookie("posId",null);
	$.getScript(url,function(){});	
};

window.clickStream = function(flag){//改动时，请同步milo.plugin
	if(!flag){
		window.console && window.console.log('-=clickStream: not found flag =-');
		return false;
	}
	this.flag = flag;
	this.getStep = function(pathname){
		if((new RegExp('^\/'+this.flag+'\/(index.shtml)?$')).test(pathname) || (new RegExp('^\/mall\/(index.shtml)?$')).test(pathname) || (new RegExp('^\/\w+\/act\/rushbuy.shtml$')).test(pathname)){
			return 1;//分商城首页、大商城首页、限时折扣页面
		}else if((new RegExp('^\/'+this.flag+'\/list\/')).test(pathname) || (new RegExp('^\/mall\/tao.shtml')).test(pathname) || (new RegExp('^\/mall\/miaosha.shtml')).test(pathname)){
			return 2;//分商城道具列表页、淘宝贝、闪购
		}else if((new RegExp('^\/'+this.flag+'\/item\/')).test(pathname)){
			return 3;//分商城道具详情页
		}
		return 0;//直接访问，或点击流统计范围外的页面
	};
	this.currStep = this.getStep(window.location.pathname);//0直接访问或点击流统计范围外的页面 ,1分商城首页、大首页,2道具列表页,3道具详情页
	this.prevStep = this.getStep(window.document.referrer.match(/(http:\/\/)?[^\/]*([^?]*)/i)[2]);
	this.setTrace = function(posId){
		var data = posId ? {'posId': posId, 'flag': flag} : {};
		return $.cookie('click_stream_trace', $.json2string(data), { path: "/"});
	};
	this.clearTrace = function(){
		return $.cookie('click_stream_trace', $.json2string({}), { path: "/"});
	};
	this.getTrace = function(){
		return $.parseJSON($.cookie('click_stream_trace')) || {};
	};
	this.report = function(str){
		var that = this;
		$.getScript('http://apps.game.qq.com/cgi-bin/daoju/v3/report/mall/pos_report.cgi?' + $.param({
			flag: that.flag,
			str: encodeURIComponent(str),
			_output_fmt: 2
		}), function(){
			
		});
	};
	this.showReport = function(){
		var that = this;
		var block = {};//统计区域及其内的道具
		$('.click_stream').each(function(){
			var posId = $(this).attr('click_stream_pos_id');
			var itemId = $(this).attr('click_stream_item_id');
			var flag = $(this).attr('click_stream_flag') || that.flag;
			block[flag] || (block[flag] = {});
			block[flag][posId] || (block[flag][posId] = {});
			itemId && (block[flag][posId][itemId] = itemId);
		});
		// $.each(block, function(k, v){
			// var arr = [];
			// $.each(this, function(){
				// arr.push(this);
			// });
			// block[k] = arr;
		// });
		var data_flag = [];
		var data_pos = [];
		var data_algorithm = [];
		var data_item_list = [];
		$.each(block, function(flag){
			var flag_pos = [];
			var flag_algorithm = [];
			var flag_item_list = [];
			$.each(this, function(posId){
				flag_pos.push(posId);
				flag_algorithm.push(1000);
				var item_id = [];
				$.each(this, function(itemId){
					item_id.push(itemId);
				});
				flag_item_list.push(item_id.join(','));
			});
			data_flag.push(flag);
			data_pos.push(flag_pos.join('+'));
			data_algorithm.push(flag_algorithm.join('+'));
			data_item_list.push(flag_item_list.join('+'));
		});
		
		var data = [
			10,
			window.getUin(),
			JSON_sys_time.sMsg.replace(/:\d{5}/, ''),
			data_flag.join('*'),
			data_pos.join('*'),
			data_algorithm.join('*'),
			'',
			data_item_list.join('*')
		];
		this.report(data.join('|'));
	};
	this.clickReport = function(posId, itemId){
		if(!posId || !itemId){
			return false;
		}
		var data = [
			11,
			window.getUin(),
			JSON_sys_time.sMsg.replace(/:\d{5}/, ''),
			this.flag,
			posId,
			1000,
			'',
			itemId
		];
		this.report(data.join('|'));
	};
	this.bindClick = function(){
		var that = this;
		$('.click_stream').die('click').live('click', function(){
			var posId = $(this).attr('click_stream_pos_id');
			var flag = $(this).attr('click_stream_flag') || that.flag;
			that.setTrace(posId, flag);
			//that.clickReport(posId, itemId);
		});
	};
	// this.buyReport = function(posId){
		// var data = [
			// 6,
			// window.getUin(),
			// JSON_sys_time.sMsg.replace(/:\d{5}/, ''),
			// itemId,
			// '',
			// this.flag,
			// '1',
			// price,
			// window.location.href,
			// this.currStep,
			// posId
		// ];
		// this.report(data.join('|'));
	// };
	this.init = function(){
		var that = this;
		var trace = this.getTrace();
		if(this.prevStep == 0 || this.prevStep >= this.currStep || (trace.flag && trace.flag != this.flag)){//点击流只能按step值，由小跳转到大的页面
			this.clearTrace();
		}
		if(this.currStep == 1){
			this.showReport();
			this.bindClick();
		}else if(this.currStep == 2){
			if(this.prevStep == 1 && trace.posId){
				return;//如果从一级页面进入二级页面，且已记录posId，则使用一级页面的posId
			}else{
				this.showReport();
				this.bindClick();
			}
		}else if(this.currStep == 3){
			var posId = trace.posId;
			//var itemId = $(this).attr('click_stream_item_id');
			var itemId = window.location.pathname.replace(/\D/g, '');
			that.clickReport(posId, itemId);
			// $('.click_stream').die('click').live('click', function(){
				// var posId = $(this).attr('click_stream_pos_id');
				// var itemId = $(this).attr('click_stream_item_id');
				// that.setTrace(posId);
				// that.clickReport(posId, itemId);
			// });
		}
	};
	
	
	// this.buy = function(itemId, price){
		// this.buyReport(this.getTrace().posId, itemId, price);
	// };
};


function initMember(){
	LoginManager.checkLogin(function () {
		$("#unlogin_index").hide();	
		$("#logined_index").show();
		var params = {
			appid: 1003,
			optype: 'get_baseinfo',
			output_format: 'jsonp',
			view_type: 'account_info,social_info',
			p_tk: getACSRFToken($.cookie('skey')) || ''
		};
		$.getScript('http://apps.game.qq.com/daoju/v3/api/we/member/Member.php?'+$.param(params), function(){
			var json = omember;
			json.data[0].iGrowthTrans = parseInt(json.data[0].iGrowth/100);
			json.data[0].iRichTrans = parseInt(json.data[0].iRich/100);
			json.data[0].iAttractTrans = parseInt(json.data[0].iAttract/100);
			json.data[0].sNextDegreeMinTrans = parseInt(json.data[0].sNextDegreeMin/100);
			json.data[0].iSaveTotalTrans = parseFloat(json.data[0].iSaveTotal/100).toFixed(2);
			json.data[0].sIcon = json.data[0].sIcon.replace(/_head\/\d+/i, '_head/128').replace(/&s=\d+/i, '&s=160');
			
			$('#header_face_img').attr('src', json.data[0].sIcon);
			$('#con_face_img').attr('src', json.data[0].sIcon);
			$('#header_nick').html(json.data[0].sName);
			$('#con_nick').html(json.data[0].sName);
			$('#header_attract').html(json.data[0].iAttractTrans);
			$('#header_rich').html(json.data[0].iRichTrans);
			$('#header_gongxun').html(json.data[0].iGrowthTrans);
			//var next_level_needed = json.data[0].sNextDegreeMinTrans-json.data[0].iGrowthTrans;
			//$('#header_next_level_needed').html(next_level_needed);
			//$('#con_next_level_needed').html(next_level_needed);
			
			$('#header_uin').html(LoginManager.getUserUin());
			

			$('#logined').hover(function(){
				$('#logined .loginhover').show();
			}, function(){
				$('#logined .loginhover').hide();
			});
		});
		
	});
}

function initXinyue(){
	LoginManager.checkLogin(function () {
		$.getScript('http://apps.game.qq.com/daoju/v3/api/we/member/accounts/UserAccounts.php?op=get_xy', function(){
			var json = ouser_accounts;
			if(json.ret==0){
				if(typeof(json.data)!='undefined' && json.data){
					var point=parseInt(json.data.point);
					var sNextDegreeMinTrans=0;
					var currRank=1;
					if(json.data.type=='0'){
						sNextDegreeMinTrans=50000;
						currRank=1;
					}
					if(json.data.type=='1'){
						sNextDegreeMinTrans=100000;
						currRank=2;
					}
					if(json.data.type=='2'){
						sNextDegreeMinTrans=800000;
						currRank=3;
					}
					if(json.data.type=='3'){
						currRank=4;
						sNextDegreeMinTrans=800000;//已是最高等级
					}
					if(json.data.type=='0'){
						$('#header_growth_level_text').html('非会员');
						$('#header_growth_level').addClass('ico_nonvip').attr('title', '非会员');
						$('#con_growth_level').addClass('vip0').attr('title', '非会员');
					}else{
						$('#header_growth_level_text').html('会员VIP'+json.data.type);
						$('#header_growth_level').addClass('ico_vip'+json.data.type).attr('title', '会员VIP'+json.data.type);
						$('#con_growth_level').addClass('vip'+json.data.type).attr('title', '会员VIP'+json.data.type);
					}
					if(json.data.type=='3'){
						$('#header_svover').width($('#header_valuebar').width());
						$('#header_gthbar').html(point+'/'+sNextDegreeMinTrans);
						$('#con_gthbar').html(point+'/'+sNextDegreeMinTrans);
						$('#con_svover').animate({
							width: $('#con_svaluebar').width()
						}, 'slow');
					}else{
						$('#header_svover').width(point/sNextDegreeMinTrans*$('#header_valuebar').width());
						$('#header_gthbar').html(point+'/'+sNextDegreeMinTrans);
						$('#con_gthbar').html(point+'/'+sNextDegreeMinTrans);
						$('#con_svover').animate({
							width: point/sNextDegreeMinTrans*$('#con_svaluebar').width()
						}, 'slow');
					}
				}
			}

		});

	});
}
function initJudou(){
	LoginManager.checkLogin(function(){
		$.getScript('http://apps.game.qq.com/daoju/appmarket/daoju_promotion/cloud_ticket/QueryCloudTicket.php?acctid=A100078&id=28', function(){
			$('#header_judou').html(sCLOUDJF_RES.data.ticket);
			$('#con_judou').html(sCLOUDJF_RES.data.ticket);
		});
	});
}

/**
 * aop after覆盖
 * @desc aop after覆盖
 * @param {function} func after function
 * @return {function} 返回覆盖的函数
 */	 
Function.prototype.after = function(func){
	var __self = this;
	return (function(){
		var ret = __self.apply(this,arguments);
		if(ret===false){
			return false;
		}
		func&&func.apply(this,arguments);
		return ret;
	});
}

/**
 * aop before覆盖
 * @desc aop before覆盖
 * @param {function} func before function
 * @return {function} 返回覆盖的函数
 */	 
Function.prototype.before = function(func){
	var __self = this;
	return (function(){
		func&&func.apply(this,arguments);
		return __self.apply(this,arguments);
	});
}


function getACSRFToken(str){  
	if(str){
		var hash = 5381;  
		for(var i = 0, len = str.length; i < len; ++i){  
			hash += (hash << 5) + str.charAt(i).charCodeAt();  
		}  
		return hash & 0x7fffffff;
	}
}


/*if(typeof(globalvar)!="undefined"&&globalvar.flag=="dnf"){
	location.href="http://daoju.qq.com";
}*/
if(location.href.indexOf('qq.com') >= 0) {
	document.domain = 'qq.com';
}

$.getServerDateTime();
$('.top_link .djm').attr('href', 'http://daoju.qq.com/act/djc/a20160317appxz/index.html');
