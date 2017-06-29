/**
	$ 通过id|class|标签名获取元素
	@param string
	@author liwenhao(pine_lxk@163.com)
	@Update 2016/08/05
*/
function $(param){
	//获取标志信息 （. # ）
	var firstChar = param.charAt(0);
	//判断是不是id
	if(firstChar == '#'){
		//把标志去掉
		param = param.substr(1);
		return document.getElementById(param);
	}
	//判断是不是class
	if(firstChar == '.'){
		//把标志去掉
		param = param.substr(1);
		//判断是否支持getElementsByClassName
		if(document.getElementsByClassName){
			var eles = document.getElementsByClassName(param);
			if(eles.length == 0){
				return null;
			}
			if(eles.length == 1){
				return eles[0];
			}
			return eles;
		}else{
			//通过标签名*获取所有的元素
			var allEles = document.getElementsByTagName('*');
			//定义空数组，用于存储匹配到的元素
			var collect = [];
			//遍历所有的元素，通过class进行匹配
			for(var i=0; i<allEles.length; i++){
				//获取当前元素的class内容  className
				var className = allEles[i].className;
				if(className == param){
					collect.push(allEles[i]);
				}
			}
			//判断有没有找到,没找到的话返回null（类似id）
			if(collect.length == 0){
				return null;
			}
			//判断是不是只有一个,直接返回元素而不是返回数组
			if(collect.length == 1){
				return collect[0];
			}
			return collect;
		}
	}
	//通过标签名获取元素
	var eles = document.getElementsByTagName(param);
	if(eles.length == 0){
		return null;
	}
	if(eles.length == 1){
		return eles[0];
	}
	return eles;
}

//--------------------16-08-05-------------------------------

/**
	previous 获取前一个元素兄弟节点
	element 当前元素节点
*/
function previous(element){
	
	//判断有没有前一个兄弟节点
	if(!element.previousSibling){
		return null;
	}
	//判断是否支持previousElementSibling
	if(element.previousElementSibling){
		return element.previousElementSibling;
	}
	//判断前一个节点的类型是不是元素节点
	if(element.previousSibling.nodeType == 1){
		return element.previousSibling;
	}
	//继续查找下一个兄弟节点
	return previous(element.previousSibling);
	/*
	var pre = element.previousElementSibling
				||
			 (( element.previousSibling.nodeType == 1 )
			 ? element.previousSibling : 
			 previous(element.previousSibling)) ;
	return pre;
	*/
}
/**
	next 获取后一个元素兄弟节点
	element 当前元素节点
*/
function next(element){
	//判断有没有后一个兄弟节点
	if(!element.nextSibling){
		return null;
	}
	//判断是否支持nextElementSibling
	if(element.nextElementSibling){
		return element.nextElementSibling;
	}
	//判断下一个节点的类型是不是元素节点
	if(element.nextSibling.nodeType == 1){
		return element.nextSibling;
	}
	//继续查找下一个兄弟节点
	return next(element.nextSibling);
}

/**
	first 查找第一个子元素节点
	element  
*/
function first(element){
	if(!element.firstChild){
		return null;
	}
	console.log(1);
	if(element.firstElementChild){
		return element.firstElementChild;
	}
	console.log(1);
	if(element.firstChild.nodeType == 1){
		return element.firstChild;
	}
	console.log(1);
	return next(element.firstChild);
}

/**
	last 查找最后一个子元素节点
	element  
*/
function last(element){
	if(!element.lastChild){
		return null;
	}
	if(element.lastElementChild){
		return element.lastElementChild;
	}
	if(element.lastChild.nodeType == 1){
		return element.lastChild;
	}
	return previous(element.lastChild);
}

/**
	css 获取或者设置元素的样式
	css($('div'),'width','100px');
*/
function css(elem,param1,param2){
	//
	if(arguments.length <= 1){
		return;
	}
	//获取样式
	if(arguments.length == 2){
		if(elem.currentStyle){
			return elem.currentStyle[param1];
		}
		return window.getComputedStyle(elem)[param1];
	}
	//改元素设置样式
	elem.style[param1] = param2;
}

//--------------------16-08-08-------------------------------

/*
	添加事件监听 兼容
	addEvent(elem,type,fn,choose);
	elem 需要添加事件监听的元素
	type 事件类型 一律不加on
	fn 回调函数（要做的事情）
	choose 冒泡或者捕捉 默认为false
	
*/
function addEvent(elem,type,fn,choose){
	if(arguments.length < 3){
		return ;
	}
	//给choose赋初值
	choose = choose || false;
	//判断浏览器是否支持addEventListener
	if(elem.addEventListener){
		elem.addEventListener(type,fn,choose);
	}else {
		elem.attachEvent('on'+type , fn , choose);
	}
}

//--------------------16-08-10-------------------------------

/**
	setCookie 设置cookie 封装
	key cookie名
	value cookie值
	time 保存的天数（必须是整数）
*/
function setCookie(key,value,time){
	if(arguments.length <=1 ){
		return ;
	}
	if(arguments.length == 2 ){
		document.cookie = key + '=' + value;
		return ;
	}
	var date = new Date(Date.now() + time*24*60*60*1000);
	date = date.toGMTString();
	document.cookie = key + '=' + value + ';expires=' + date;
	return document.cookie;
}


/**
	getCookie 获取cookie
	key  cookie名
*/
function getCookie(key){
	var str = document.cookie;
	var cookieArr = str.split('; ');
	console.log(cookieArr);
	for(i in cookieArr){
		//获取 = 在字符串中的位置
		cookieArr[i] = cookieArr[i].replace(' ','');
		var position = cookieArr[i].indexOf('=');
		//提取=号之前的key
		var keyInner = cookieArr[i].substring(0,position);
		//比对当前提取的key和传入的key
		if(keyInner == key){
			//获取 = 后面的value值
			var value = cookieArr[i].substr(position+1);
			return value;
		}
	}
}

/**
	delCookie 删除cookie
	key cookie名字
*/
function delCookie(key){
	setCookie(key,'',-1);
}

//---------------------------08-17-------------------------

/**
	给元素添加某个class样式
	elem 元素
	str 添加的样式
*/
function addClass(elem,str){
	//   /(^|\s)item(\s|$)/ 
	var reg = new RegExp('(^|\\s)'+str+'(\\s|$)');
	if(!reg.test(elem.className)){
		elem.className += ' ' + str;
	}
}
/**
	去除元素的某个class样式
	elem 元素
	str 去除的样式
*/
function removeClass(elem,str){
	var arr = elem.className.split(/\s+/);
	var cname = [];
	for(var i=0; i<arr.length; i++){
		if(arr[i] != str){
			cname.push(arr[i]);
		}
	}
	elem.className = cname.join(' ');
}


//---------------------------08-18-------------------------

/**
	Ajax 异步请求数据封装
	@param  json
		type 请求类型
		url 请求的地址
		data 发送的数据
		success 请求成功之后要做什么
		error 请求失败时要做什么（一般用于查看错误信息）
*/
function ajax(param){
	//对type做兼容
	var type = param.type || 'post';

	var xhr = null;
	//第一步 获取和服务器通信的代理对象 到邮局拿信封和邮票
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		xhr = new ActiveXObject(Microsoft.XMLHTTP);
	}

	//第二步 连接（声明请求方式及请求地址）  填写邮寄地址及邮寄方式
	//xhr.open(请求方式,请求的地址,是否异步)
	if(type == 'get'){
		xhr.open(type,param.url+'?'+formatData(),true);
		xhr.send(null);
	}else if(type == 'post'){
		xhr.open(type,param.url,true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(formatData());
	}

	//焦急的等待服务器的相应（监听服务是否返回） 焦急等待女神是否回信
	xhr.onreadystatechange = function(){
		//判断服务是否响应
		if(xhr.readyState == 4) {
			if(xhr.status == 200){
				var result = eval( '(' + xhr.responseText + ')');
				param.success && param.success(result);
			}else if(xhr.status == 404){
				param.error && param.error(xhr.responseText);
			}
		}
	}
	// 把json数据格式转化为字符串（'username=123&password=123'）
	function formatData(){
		var data = param.data;
		var str = '';
		for(i in data){
			str += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
		}
		str += 'key='+Math.random();
		return str;
	}
}

//------------------------------------08-22----------------------------------

/**
	运动框架 animate
	@param
		elem 元素
		json 需要改变的一个或多个样式名和样式值
		time 运行时间
		fn 动画完成的时候要做的事情
		
	$('.move2').onmouseenter = function(){
		animate(this,{
			'opacity': 1,
			'width': 500,
			'height': 300,
			'margin-left': 200
		},500,function(){
			$('.move2').style.display = 'none';
		});
	}
*/
function animate(elem,json,time,fn){
	clearInterval(elem.timer);
	//完成动画的时间
	time = time || 400;
	
	var arr = [];
	
	for(i in json){
		var obj = {};
		obj.type = i;
		obj.end = json[i];
		obj.start = parseFloat( css(elem,i) );
		obj.speed = (json[i]-obj.start)/Math.ceil(time/13);
		arr.push(obj);
	}
	//定义已经结束动画的样式名
	var endArr = [];
	elem.timer = setInterval(function(){
		for(var j=0; j<arr.length; j++){
			arr[j].start += arr[j].speed;
			/* 
				初始值比目标值小 speed是正值 2 >= 3(flase)  5 >= 3(true)  （2是初始值 越来越大）
				初始值比目标值大 speed是负值 8 <=5 (flase) 3 <= 5(true)  -3 >= -5 （8是初始值，越来越小）
			*/
			if(arr[j].start * arr[j].speed >= arr[j].end * arr[j].speed){
				//获取已经完成动画的样式名
				var str = endArr.join(';');
				if(str.indexOf(arr[j].type) <= -1){
					endArr.push(arr[j].type);
				}
				
				elem.style[arr[j].type] = ((arr[j].type=='opacity') ? arr[j].end : arr[j].end+'px');
				//elem.style[type] = end + 'px';
			}else {
				elem.style[arr[j].type] = ((arr[j].type=='opacity')?arr[j].start:arr[j].start+'px');
			}
			//如果所有的动画已经完成，清除定时器
			if(endArr.length == arr.length){
				clearInterval(elem.timer);
				fn && fn();
				return;
			}
		}
	},13);
	/*
		if(type == 'opacity'){
			elem.style[type] = start;
		}else{
			elem.style[type] = start + 'px';
		}*/
}