/**
 * @author haryli 
 * @version 2.0
 * @date 2012-12-14 
 * @class Core.MT
 * <pre><code>
 * scode:
 * 1000 服务器全局变量返回未定义
 * 1001 服务器返回数据状态不为0
 * 1002 网络问题导致
 * 
 * servercode:
 * -5005 购物车已满
 * </code></pre>
 * <p>
 * 该js是商城的核心业务库<br/>
 * 方法集主要包括：道聚城业务下有关内部cgi数据调用和页面渲染的方法集操作，主要包括购物车数据操作，角色信息查询、<br/>
 * 本类中所有方法被绑定到MT对象中，可直接使用MT.method调用。<br/>
 * </p>
 * SVN: $Id: dj_co.js 36815 2014-07-01 03:48:47Z haryli $
 */

if( typeof (MT) == "undefined") {
	/**
	 * @cfg {object} MT 道聚城业务操作核心实例
	 * 默认设置：
	 * <pre><code>
	 * //全局默认设置
	 * MT = {
					global:{
						existMethod:function(msg){
							alert(msg)
						},//购物车已存在该道具的提示操作
						flag:globalvar.flag||"",
						host:"daoju.qq.com",
						path:"apps.game.qq.com/cgi-bin/daoju/market/",
						error:function(msg){
							alert(msg);
						},
						fullCartError:function(msg){
							alert(msg);
						},
						notExistMethod:function(msg){
							alert(msg);
						},
						//修改数量的默认全局函数
						numErrorMethod:function(msg){
							alert(msg);
						},
						defaultMsg:"很抱歉由于现在访问的人数过多，系统繁忙，请稍后再试~"
					},
					setGlobalOption:function(option){
						this.global = $.extend(this.global,option||{});
					}		
				}
	 * </code></pre>
	 */
	MT = {
			//全局默认设置
			global:{
				existMethod:function(msg){
					alert(msg)
				},//购物车已存在该道具的提示操作
				flag:globalvar.flag||"",
				host:"daoju.qq.com",
				path:"apps.game.qq.com/cgi-bin/daoju/market/",
				error:function(msg){
					alert(msg);
				},
				fullCartError:function(msg){
					alert(msg);
				},
				notExistMethod:function(msg){
					alert(msg);
				},
				//修改数量的默认全局函数
				numErrorMethod:function(msg){
					alert(msg);
				},
				defaultMsg:"很抱歉由于现在访问的人数过多，系统繁忙，请稍后再试~"
			},
			setGlobalOption:function(option){
				this.global = $.extend(this.global,option||{});
			},
			cur_paytype:"qpqb"//默认当前支付方案；
	};

	globalvar.transTicketRelate = globalvar.flag == 'r2' ? 1 : 0.01;//临时解决，后台上线后删除

	MT['cart_discount'] = {};
	MT['cart_discount']['use_ticket'] = true;
	MT['cart_discount']['use_coupon'] = globalvar.hasYhq > 0 ? true : false;
	MT['cart_discount']['ticket'] = '';//购物点点数，不使用时为空
	MT['cart_discount']['max_ticket'] = 0;//最多使用购物点数量
	MT['cart_discount']['coupon_id'] = '';//优惠券id，不使用时为空
	MT['cart_discount']['dq'] = 0;//使用点券
	
}

function cartPrice(option){//输入单位均为 '分'
	option || (option = {});
	this.total = option.total || 0;
	this.coupon = option.coupon || 0;
	this.ticket = option.ticket || 0;
	this.dq = option.dq || 0;
	this.reset = function(){
		var totalQb = MT.Unit.transQbPrice(this.total);
		var couponQb = MT.Unit.transQbPrice(this.coupon);
		var ticketQb = this.ticket * globalvar.transTicketRelate;
		ticketQb = Math.max(Math.min(totalQb - couponQb, ticketQb), 0);
		this.ticket = parseFloat(ticketQb / globalvar.transTicketRelate).toFixed(2);

		var dqQb = MT.Unit.transQbPrice(this.dq);
		dqQb = Math.max(Math.min(totalQb - couponQb - ticketQb, dqQb), 0);
		this.dq = parseFloat(dqQb*100).toFixed(0);
		//console.log('this.dq',this.dq);

		var real = Math.max(totalQb - couponQb - ticketQb - dqQb, 0);

		if(globalvar.flag=='dnf'){//只有dnf使用点券
			$('#js_real_QB_area').hide();
			$('#price_info').hide();
			$('#js_real_DQ_area').show().find('#js_real_DQ').html(this.total);
			$('#dnf_real_last_QB').html(this.total);//点券总额
			$('#dnf_recharge_QB').html(Math.ceil(totalQb - dqQb));//还差多少点券,100的整数倍
			$('#dnf_real_last_QB_2').html(this.total);//点券总额
			return;
		}

		$('#js_real_QB').html(parseFloat(real).toFixed(2));
		//console.log('cartprice', ''+this.total+'----'+this.coupon+'-----'+this.ticket);
		var priceInfo = [];
		if(couponQb > 0 || ticketQb > 0){
			priceInfo.push('总价:<span id="js_total_QB" class="font_red_b">'+parseFloat(totalQb).toFixed(2)+'</span>');
			couponQb > 0 && priceInfo.push('- 优惠券:<span id="js_yhq_QB" class="font_red_b">'+parseFloat(couponQb).toFixed(2)+'</span>');
			ticketQb > 0 && priceInfo.push('-购物点:<span id="js_gwd_QB" class="font_red_b">'+parseFloat(ticketQb).toFixed(2)+'</span>');
			priceInfo.push(' = ');
			$('#price_info').html(priceInfo.join('')).show();
		}else{
			$('#price_info').hide();
		}
		SpeedFeedBack.set(real);
		OrderGift.set(real*100);
	};
}
 //订单满赠
function orderGift(){//price 单位： 分
	this.data = '';
	this.callbackList = [];
	this.isLoaded = false;
	this.set = function(price){
		var that = this;
		price = parseFloat(price).toFixed(0) || 0;
		that.data ? that.render(price) : that.load(function(){that.render(price);});
	};
	this.load = function(callback){
		this.callbackList.push(callback);
		var that = this;
		if(that.isLoaded){
			that.reduce();
		}else{
			$.getScript('http://daoju.qq.com/time/market/js/'+globalvar.flag+'/order_gift.js?r='+Math.random(), function(){
				that.data = window.orderGiftData;
				that.isLoaded = true;
				that.reduce();
			});
		}
		
	};
	this.reduce = function(){
		for(var i = 0; i<this.callbackList.length; i++){
			this.callbackList[i]();
		}
		this.callbackList = [];
	},
	this.render = function(price){
		var html = [];
		var that = this;
		var currDate = JSON_sys_time.sMsg.replace(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*/g, '$1');
		var isSuccess = /success2.shtml/.test(location);
		if(that.uin && ($.cookie('uin')||'').indexOf(that.uin) == -1){
			return false;
		}
		if(that.data && that.data.list && currDate >= that.data.begin_time && currDate < that.data.end_time){
			that.data.list && $.each(that.data.list, function(){
				//if(price >= this.pay_amount_min && price <= this.pay_amount_max){
				if(parseFloat(price) >= parseFloat(this.pay_amount_min) && parseFloat(price) <= parseFloat(this.pay_amount_max)){
					var tmpHtml = [];
					var goodsNames = [];
					this.list && $.each(this.list, function(){
						if(this.giftType != 'coupon' || (currDate >= this.dtBeginTime && currDate < this.dtEndTime)){
							goodsNames.push('【'+this.sGoodsName+'】');
						}
					});
					if(goodsNames.length){
						tmpHtml.push('<div class="cart_total_box clear" style="margin-top:16px; background-color:white;">');
						tmpHtml.push('<div style="background-color:red;color:white;font-size:110%;line-height:23px;width:45px;text-align:center;float:left;margin-top:6px;margin-left:5px;">满赠</div>');
						tmpHtml.push('<div style="width: 20px; height: 22px; float: left; background: url(&quot;http://js01.daoju.qq.com/common/images/channel/ordergift_beep.png&quot;) no-repeat scroll 0px 0px transparent;margin-top:7px;margin-left:10px"></div>');
						tmpHtml.push('<div style="float:left;color:#9C9C9C;font-weight:bolder;margin-left:10px;">今日特惠：'+(isSuccess ? '恭喜您获得' : '')+'</div>');
						tmpHtml.push('<div style="float:left;color:red;">'+(isSuccess ? '' : '订单满'+parseFloat(this.pay_amount_min/100).toFixed(2)+'Q币，送'));
						tmpHtml.push('<span style="font-weight:bolder;">');
						tmpHtml.push(goodsNames.join(''));
						tmpHtml.push('</span>活动截止时间:'+that.data.end_time+'</div>');
						tmpHtml.push('<div style="float:left;color:#9C9C9C;margin-left:10px;">（金额以实付款为准）</div>');
						tmpHtml.push('</div>');
					}
					html = tmpHtml;
				}
			});
		}
		
		$('#award_list').html(html.join(''));
	};
}

//speed魅力值和回馈点
function speedFeedBack(){
	this.isSurport = window.globalvar.flag == 'speed' ? true : false;
	this.set = function(priceQb){
		if(this.isSurport){
			var glamour = Math.round(priceQb);
			var feedback = Math.round(priceQb*10);
			glamour > 0 ? $('#cart_glamour .js_feedback_price').html(glamour).show() : $('#cart_glamour').hide();
			feedback > 0 ? $('#cart_feedback .js_feedback_price').html(feedback).show() : $('#cart_feedback').hide();
			$('#cart_feedback_list').show();
		}
	};
};

var CartPrice = new cartPrice;
var OrderGift = new orderGift;
var SpeedFeedBack = new speedFeedBack;
//点击流统计
window.ClickStream = new window.clickStream(window.globalvar.flag);
if(ClickStream.currStep == 1){
	var click_stream_timeout_id = window.setInterval(function(){
		if(window.biz_flashads_adlist && window.hot_rank && (window.JSON_recommend || window.JSON_recommend_loaded)){
			window.clearInterval(window.click_stream_timeout_id);
			window.ClickStream.init();
		}
	}, 50);
}else{
	window.ClickStream.init();
}


window.onload = function(){
	MT.windowLoad = true;
	MT.showCartDiscountBlock();
};
//实例扩展
$.extend(MT, {
	initCartDiscountBlock:function(){
		if(JSON_show_login !== undefined && JSON_show_login.ticket > 0){
			MT['cart_discount']['use_ticket'] = true;
		}else{
			MT['cart_discount']['use_ticket'] = false;
		}
		
//		MT['cart_discount']['use_coupon'] = globalvar.hasYhq > 0 ? true : false;
		MT['cart_discount']['ticket'] = '';//购物点点数，不使用时为空
		MT['cart_discount']['coupon_id'] = '';//优惠券id，不使用时为空
	},
	showCartDiscountBlock:function(){
		if(!MT.windowLoad) return;
		if(MT['cart_discount']['use_ticket'] || MT['cart_discount']['use_coupon']){
			$('#yhq_info').show();
		}
		//else{
		//	$('#yhq_info').hide();
		//}
		if(MT['cart_discount']['use_coupon']){
			//$('#tab_yhq').show();
		}else{
			$('#tab_yhq').hide();
		}
		if(window.MT['cart_discount']['use_ticket']){
			$('#tab_gwd').show();
		}else{
			$('#tab_gwd').hide();
		}
		
	},
	/**
	 * 首页新闻公告
	 * @param {string} selector jQuery 选择器 
	 * @return {null} 无
	 */	 
	showNews:function(selector){
		var get_tpl = function(link,title){
			return  '<li><a href="'+link+'" target="_blank" title="'+title+'">'+title+'</a></li>';
		};
		if(globalvar.flag == 'h2'){
		
			var url = "http://daoju.qq.com/time/v3/mall/"+globalvar.flag+"/js/page/notice.js";
			$.getScript(url,function(){
				var infos = "";
					page_news && $.each(page_news,function(k,v){
						var link = "http://daoju.qq.com/mall/notice.shtml?notice="+v['iSeqId'];
						if(v['sName'].length>14){
							infos+= get_tpl(link,v['sName'].substr(0,13)+"...");
						}else{
							infos+= get_tpl(link,v['sName']);
						}
					});
				$(selector).each(function(item){
					$(this).html(infos);
				});
			});
		}else{
			var url = "http://daoju.qq.com/time/market/js/news/news_"+globalvar.flag+".js";
			$.getScript(url,function(){
				var infos = "";
				if(typeof(eval("news_"+globalvar.flag))!="undefined"){
					$.each(eval("news_"+globalvar.flag),function(k,v){
						var link = "http://daoju.qq.com/mall/notice.shtml?notice="+v['iSeqId'];
						if(v['sName'].length>14){
							infos+= get_tpl(link,v['sName'].substr(0,13)+"...");
						}else{
							infos+= get_tpl(link,v['sName']);
						}
					});
				}
				$(selector).each(function(item){
					$(this).html(infos);
				});
			});
		}
	},
	/**
	 * 道聚城首页的消费排行
	 * @param {string} tplid html dom元素id
	 * @return {null} 无
	 */
	makeMoneyRank:function(tplid){
		var url = "http://daoju.qq.com/time/market/js/"+globalvar.flag+"/MoneyRank.js"
		$.getScript(url,function(){
			if(typeof(MoneyRank)=="undefined"){
				//系统繁忙请稍后再试
			}else{
				var index = 1;
				$.each(MoneyRank,function(k,item){
					if(index<10){
						item['index'] = "0"+index;
					}else{
						item['index'] = index;
					}
					index++;
					item['iPriceQB'] = MT.Unit.transQbPrice(item["iPrice"]);
				});
				$.fillListTpl(tplid,MoneyRank);
			}
		});
	},
	/**
	 * 用户角色信息查询
	 * @param {string} zone 大区id
	 * @param {string} uin 用户QQ号
	 * @param {function} callback 回调函数
	 * @return {null} 无
	 */
	showRole : function(zone, uin, callback) {
		if(!zone || zone == "") {
			return;
		}
		var flag = '';
		if(MT.global.flag == 'codol'){
			flag = 'codo';
		}else if(MT.global.flag == 'mho'){
			flag = 'mh';
		}else{
			flag = MT.global.flag;
		}
		
		if(uin==""||uin==null){
			//http://apps.game.qq.com/comm-cgi-bin/content_admin/activity_center/query_role.cgi?game=fsf&area=1101&callback=14132803674064706
			//apps.game.qq.com/cgi-bin/daoju/market/
			var url = "http://apps.game.qq.com/comm-cgi-bin/content_admin/activity_center/query_role.cgi?game=" + flag + "&area=" + zone + "&r="+Math.random();
			$.getScript(url,function(){
				callback(query_role_result);
			});
		}else{
			var url = "http://"+MT.global.path+"list_role.cgi?flag=" + flag + "&iZone=" + zone + "&iSendQQ=" + uin+"&r="+Math.random();
			$.getScript(url,function(){
				callback(JSON_list_role);
			});
		}
	},
	/**
	 * 关注道具信息
	 * @param {object} option 
	 * 默认字段有：
	 * <pre><code>
	  {
				"iGoodsSeqId":"", 	//物品id
				"content":"",			//关注的内容信息
				"location":"",			//关注来源
				"url":"",					//页面地址
				"iActId":"",				//对活动那个的兼容性处理，非活动可不填
				"sGoodsName":"", //道具名称
				"tiptime":"",			   //tip发送提示时间
				"sActName":"",	   //活动名称
				"piclink":""			  //道具图片地址
		}
	 </code></pre>
	 * @param {function} callback 回调函数
	 * @return {bool} 取消浏览器的默认事件
	 */
	collectGood:function(option,callback){
		var option_ = {
				"iGoodsSeqId":"",
				"content":"",
				"location":"",
				"url":"",
				"iActId":"",
				"sGoodsName":"",
				"tiptime":"",
				"sActName":"",
				"piclink":""
		};
		var opt = $.extend(option_,option);
		var url = "http://"+MT.global.path+"attend_goods.cgi?flag="+MT.global.flag+"&"+$.param(opt)+"&r="+Math.random();
		$.getScript(url,function(){
			if($.isFunction(callback))
			{
				callback(JSON_attend_goods);
			}
		});
		return false;
	},
	/**
	 * 微博分享
	 * @param {function} callback 回调函数
	 * @return {bool} 取消浏览器的默认事件
	 */
	shareWB:function(callback){
		var url = "http://"+MT.global.path+"/share_page.cgi?type=json&flag="+MT.global.flag+"&sActionType=Goods&sShareType=Weibo"+"&r="+Math.random();
		$.getScript(url,function(){
			if($.isFunction(callback)){
				callback(JSON_share_page);
			}
		});
		return false;
	},
	/**
	 * 是否是vip
	 * @param {object} option 回调函数
	 * 默认参数：
	 * <pre><code>
	    {
				"callback":null,//回调函数
				"vip":""			//vip类型，包括blue(蓝钻会员),qq(QQ会员)...
		}
	 </code></pre>
	 * @return {null} 无
	 */
	isVip:function(option){
		var default_setting = {
				"callback":null,
				"vip":""
		};
		option = $.extend({},default_setting,option);
		var url = "http://"+MT.global.path+"/show_user_info.cgi?flag="+MT.global.flag+"&query_type="+option.vip+"&r="+Math.random();
		$.getScript(url,function(){
			if($.isFunction(option.callback)){
				option.callback(JSON_show_user_info);
			}
		});
	},
	/**
	 * 道具列表通用查询和页面展示功能模块
	 * @param {object} option 回调函数
	 * 默认参数：
	 * <pre><code>
	   {
				uri:"http://apps.game.qq.com/cgi-bin/daoju/market/show_goods.cgi",
				page:"",
				grepFunc:null,
				params:{},
				tplId:"",
				tplContId:"",
				pn_key:"page_no",
				ps_key:"page_size",
				jsonp:"JSON_show_goods",
				noThing:function(data){
					noThing(data);
				},
				error:function(data){
					
				},
				success:function(data){}
		}
	 </code></pre>
	 * @return {null} 无
	 */
	showDataList:function(option){
		var default_ = {
				uri:"http://apps.game.qq.com/cgi-bin/daoju/market/show_goods.cgi",
				page:"",
				grepFunc:null,
				params:{},
				tplId:"",
				tplContId:"",
				pn_key:"page_no",
				ps_key:"page_size",
				jsonp:"JSON_show_goods",
				noThing:function(data){
					noThing(data);
				},
				error:function(data){
					
				},
				success:function(data){}
		};
		var option = $.extend(default_,option);
		//默认分页大小
		var $page_size = globalvar.page_size||18,$page_no = 1;
		var params = $.param(option.params);
		var url_ =  option.uri+"?flag="+MT.global.flag+"&"+params;
		var url = option.uri+"?flag="+MT.global.flag+"&"+option.ps_key+"="+$page_size+"&"+option.pn_key+"="+$page_no+"&"+params+"&r="+Math.random();
		var makePage = function(total, cur_pn) {
			if(parseInt(total)<=parseInt($page_size)){
				$(option.page).empty().hide();
				return false;
			}
			$(option.page).empty().jpage({
				'total_num' : total,
				'url' : url_,
				'curr_num' : cur_pn,
				'pn_key' : option.pn_key,
				'ps_key' : option.ps_key,
				'page_size' : $page_size,
				'do_default' : false,
				'first' : "",
				'last' : "",
				"prev":"<em class=prv_off_icon></em>上一页",
	            "next":"下一页<em class=next_on_icon></em>",
				"p_f":"p_f",
	            "p_l":"p_l",
	            "p_prev":"prv_off_btn",
	            "p_next":"next_on_btn",
	            "page_btn":"page_no",
	            "on":"cur_page_bg",
	            "com_class":"page_bg",
				'clickEvent' : function(obj) {
					$obj = $(obj);
					var url = $obj.attr("href")+"&cnt="+total;
					var last_no = Math.ceil(parseInt(total)/$page_size);
					var cur_pn = $obj.attr("page");
					if(cur_pn!="1") {$(".prev_page em").removeClass("prv_off_icon").addClass("prv_on_icon");}else{$(".prev_page em").removeClass("prv_on_icon").addClass("prv_off_icon");};
					if(cur_pn==last_no) {$(".next_page em").removeClass("next_on_icon").addClass("next_off_icon");}else{$(".next_page em").removeClass("next_off_icon").addClass("next_on_icon");};
					$.getScript(url, function() {
						var json_p = eval(option.jsonp);
						if(typeof(json_p.compress)=="undefined"){
							var list = $.parseData(json_p.list);
						}else if(json_p.compress=="0"){
							var list = json_p.list;
						}else{
							var list = $.parseData(json_p.list);
						}
						var cnt = json_p.iTotalNum;
						if($.isFunction(option.grepFunc)){
							list = option.grepFunc(list);
						}
						var tpl_html = !option.tplContId?$.trim($("#"+option.tplId).html()):$("#"+option.tplContId).html();
						//填充模板
						$.fillListTpl(option.tplId,list,null,true,tpl_html);
					});
					return false;
				}
			});
		}
		$.getScript(url,function(){
			var json_p = eval(option.jsonp);
			if(typeof(json_p)!="undefined"&&json_p.iRet=="0")
			{
				if(json_p.iTotalNum==0)
				{
					option.noThing(json_p);
					return;
				}
				//数据处理cnt
				if(typeof(json_p.compress)=="undefined"){
					var list = $.parseData(json_p.list);
				}else if(json_p.compress=="0"){
					var list = json_p.list;
				}else{
					var list = $.parseData(json_p.list);
				}
				var cnt = json_p.iTotalNum;
				if($.isFunction(option.grepFunc)){
					list = option.grepFunc(list);
				}
				var tpl_html = !option.tplContId?$.trim($("#"+option.tplId).html()):$("#"+option.tplContId).html();
				//填充模板
				$.fillListTpl(option.tplId,list,function(data){
					//分页设置
					if( typeof ($.fn.jpage) === "undefined") {
						$.getScript("http://ossweb-img.qq.com/images/gameshop/ui/page/page_1.js", function(option) {
								makePage(cnt,1);
						});
					} else {
						makePage(cnt,1);
					}
					//回调
					option.success(data);
				},true,tpl_html);
			}
			else
			{
				//暂时处理
				option.error(json_p);
			}
		});
	},
	/**
	 * 获取关注信息
	 * @param {number} pn 当前页码
	 * @param {number} ps 每页显示的数量
	 * @param {function} callback 回调函数
	 * @return {object} 返回我关注的道具信息列表
	 */
	getAttendGoods :function(pn,ps,callback){
		var url = "http://"+MT.global.path+"show_attend_goods.cgi?flag="+MT.global.flag+"&page_size="+ps+"&page_no="+pn+"&r="+Math.random();
		$.getScript(url,function(){
			if($.isFunction(callback)){
				var list = [];
				JSON_show_attend_goods.list = $.parseData(JSON_show_attend_goods.list);
				$.each(JSON_show_attend_goods.list,function(k,v){
					v['sGoodsName'] =  decodeURI(v['sGoodsName']);
					v['sRssContent'] = decodeURI(v['sRssContent']);
					list.push(v);
				});
				callback(list);
			}
		});
	},
	/**
	 * 初始化显示最新浏览
	 * @return {null} 无
	 */
	initLAG:function(){
		var datalist = MT.getLAG();
		$.fillListTpl("lag_list",datalist,null,false);
		$("#clear_history").click(function(){
			if(confirm("确定要清空浏览历史么？")){
				MT.clearLAG();
				$("#lag_list").stop().animate({height:0,opacity:0},300,function(){
					$(this).empty();
				});
			}
			return false;
		});
	},
	/**
	 * 添加物品到购物车
	 * @param {number} iSeqId 物品的seqid
	 * @param {number} num  物品的数量
	 * @param {bool} directBuy 是否是直购，默认是false
	 * @param {number} price
	 * @return {null} 无
	 */
	buyGood:function(iSeqId,num,directBuy){
		directBuy = directBuy||false;
		var num = num||1;
		if(!iSeqId) return;
		MT.addCartItem(iSeqId,null,function(data){
			var cartUrl = "/"+globalvar.flag+"/buy2.shtml";
			if(directBuy){
				new Boxy("<p style='text-align:center;'>已经添加到购物车<a style='color:#0069B5' href='"+cartUrl+"' >“我购买的道具”</a></p>",{title:"温馨提示",closeText:" ",modal:true});
			}else{
				Boxy.ask("<p>该道具已经成功的添加到您的购物车内</p>", ['继续购物', '进入购物车'], function(response) {
					if(response == '进入购物车'){
						location.href = cartUrl;
					}else{
						$(".gwc_num").html(MT.getCartNum());
					}
				}, {title:"温馨提示",closeText:" "});
			}
			//更新右上角购物车数量
			$(".gwc_num").html(MT.getCartNum());
		},num);
	},
	/**
	 * 重置购物车数据
	 * @param {string} act 操作方式：
	 * <pre>
	 * modify:删除某个道具，或者修改道具的数量
	 * add:添加购物车道具；
	 * clear:清空购物车；
	 * show:显示购物车数据；
	 * <pre>
	 * @param {function} callBack  回调函数
	 * @param {number}  curISeqId 单签道具的iSeqId
	 * @return {null} 无
	 */
	resetCart : function(act, callBack,curISeqId) {
		if( typeof (MT[MT.global.flag + "_Cart"]) == "undefined")
			return false;
		var items = [];
		$.each(MT[MT.global.flag+"_Cart"]["list"], function(k, item) {
			items.push({
				"iSeqId" : item['iSeqId'],
				"iNum" : item['iNum'],
				"src_pos":item["src_pos"]?item["src_pos"]:($.cookie("posId")||""),
				"cur_pos":item["cur_pos"]?item["cur_pos"]:(typeof curPageType!="undefined"?(curPageType+"0"):""),
				"page_type":typeof curPageType!="undefined"?curPageType:"",
				"algorithm":item["algorithm"],
				'rec_info': item["rec_info"] ? encodeURIComponent(item["rec_info"]) : ''
				//?item["algorithm"]:(window.algorithm||"")
			});
		});
		var url ="http://"+MT.global.path+"cart.cgi?v="+Math.random();
		var params = {
			"flag" : MT.global.flag,
			"op" : act,
			"list" : $.json2string(items),
			"seqid":curISeqId,
			"type":"json",
			"page_type":$.cookie("curPage")
		};
		$.ajax({
			url : url,
			data : params,
			type : "get",
			dataType : "script",
			timeout : 6000,
			success : function(data) {
				if(typeof(JSON_cart)=="undefined")
				{
					//console.log("cgi error");
					MT.global.error(MT.global.defaultMsg);
					return;
				}
				
				if(JSON_cart.iRet!="0")
				{
					//回滚之前的操作数据
					$.each(MT[MT.global.flag+"_Cart"]['modify'],function(k,v){
						MT[MT.global.flag+"_Cart"]['list'][k] = v;
					});
					//重置modify
					MT[MT.global.flag+"_Cart"]['modify'] = {};
					MT.global.error(JSON_cart.sMsg||MT.global.defaultMsg);
					//console.log(JSON_cart.sMsg);
					return;
				}
				//删除成功清空备份
				MT[MT.global.flag+"_Cart"]['modify'] = {};
				if($.isArray(JSON_cart.list))
				{
					var cartList = {};
					var num = 0;
					$.each(JSON_cart.list,function(k,v){
						//如果价格有修改，那么需要提示用户刷新页面
						if(typeof(MT[MT.global.flag + "_Cart"]['list'][v['iSeqId']])!="undefined"&&typeof(v['iPrice'])!="undefined")
						{
							if(v['iPrice']!=MT[MT.global.flag + "_Cart"]['list'][v['iSeqId']]['iPrice'])
							{
								if(confirm("\""+v['sGoodsName']+"\"价格有变动，是否刷新页面"))
								{
									location.reload(true);
									return false;
								}
							}
						}
						if(!v.bPermitTicketBuy || v.bPermitTicketBuy < 1){
							MT['cart_discount']['use_ticket'] = false;
						}
						
						cartList[v['iSeqId']] = v;
						num++;
					});
					//MT.setCartNum(num);
					MT[MT.global.flag + "_Cart"]['list'] = cartList;
				}else{
					MT['cart_discount']['use_ticket'] = false;
					MT['cart_discount']['use_coupon'] = false;
				}
				if(JSON_cart!=undefined && JSON_show_login!=undefined){
					MT['cart_discount']['max_ticket'] = parseFloat(Math.min(MT.Unit.transQbPrice(MT.getTotalUnDisPrice())/globalvar.transTicketRelate, JSON_show_login.ticket)).toFixed(2);
					$('#inptGwd').val(MT['cart_discount']['max_ticket']);
				}
				
				
				if($.isFunction(callBack)) {
					callBack(JSON_cart);
				}
			},
			error : function(data) {
				MT.global.error(MT.global.defaultMsg);
				//console.log(data);
			}
		});
	},
	/**
	 * 获取购物车所有道具的价格总和（打折或vip折扣后的价格）
	 * @return {number} 道具总价
	 */
	getTotalPrice:function(pay_type){
//		var total_price = 0;
//		$.each(MT[MT.global.flag + "_Cart"]['list'],function(k,v){
//			var disPrice  = MT.Unit.transDiscountPrice(v["iPrice"], v["iDiscount"], v["dtDiscountBegin"], v["dtDiscountEnd"],v["iDisCntPrice"]);
//			var vipPrice  =MT.Unit.transDiscountPrice(v["iVipPrice"], v["iDiscount"], v["dtDiscountBegin"], v["dtDiscountEnd"],v["iDisCntPrice"]);
//			if(typeof(JSON_show_login)!="undefined"){
//				if(JSON_show_login.vip=="1"){
//					disPrice = vipPrice;
//				}
//			}
//			total_price+=parseInt(disPrice)*parseInt(v['iNum']);
//		});
        var price=0;
        var total_info = typeof(JSON_cart)!="undefined"?JSON_cart:JSON_order_detail;
        switch(pay_type){
            case "bank":
                price = total_info.total_bank_price;
                break;
            case "tenpayquick":
                price = total_info.total_tenpaybank_price;
                break;
            case "fastbank":
                price = total_info.total_tenpaybank_price;
                break;
            case "tenpay":
                price = total_info.total_tenpay_price;
                break;
            case "tenpaybank":
                price = total_info.total_tenpaybank_price;
                break;
            default:
                price = total_info.total_pay_price;
                break;
        }
        return parseInt(price);
	},
	/**
	 * 获取购物车所有道具的价格总和（原价总和，不进行折扣换算）
	 * @return {number} 道具总价
	 */
	getTotalUnDisPrice:function(){
		var total_info = typeof(JSON_cart)!="undefined"?JSON_cart:JSON_order_detail;
        return total_info.total_pay_price;
	},
	/**
	 * 获取购物车数据列表
	 * @param {function} callBack 回调函数
	 * @return {null}  无
	 */
	getCartData : function(callBack,areaid) {
		if(!LoginManager.isLogin()) {
			LoginManager.login();
			return false;
		}
		//设置成window的一个全局变量
		//window['lol_Cart']={list:["g_1"],bindZone:"",bindRole:""};
		var getCartInfo_mem = function(){
			var url = "http://"+MT.global.path+"cart.cgi?v="+Math.random();
			var params = {
				"flag":MT.global.flag,
				"op":"show",
				"type":"json"
			};
			areaid && (params.areaid = areaid);
			$.ajax({
				url : url,
				data : params,
				type : "get",
				dataType : "script",
				timeout : 6000,
				success : function(data) {
					if(typeof(JSON_cart)=="undefined")
					{
						//console.log("cgi error");
						MT.global.error(MT.global.defaultMsg);
						return;
					}
					
					if(JSON_cart.iRet!="0")
					{
						//console.log(JSON_cart.sMsg);
						MT.global.error(JSON_cart.sMsg||MT.global.defaultMsg);
						return;
					}
					//保存数据
					MT.saveGoods(JSON_cart.list);
					//是否需要vip,默认为
					MT[MT.global.flag + "_Cart"]["needVip"] = JSON_cart.needVip||1;
					if($.isFunction(callBack)) {
						callBack(JSON_cart);
					}
				},
				error : function(data) {
					MT.global.error(MT.global.defaultMsg);
					//console.log(data);
				}
			});
		}
		//init
		getCartInfo_mem();
		//MT.selectCartType(getCartInfo_mem,getCartInfo_cookie);
	},
	/**
	 * 获取订单数据列表
	 * @param {function} callBack 回调函数
	 * @return {null}  无
	 */
	getOrderData : function(serialNo,callBack) {
		if(!LoginManager.isLogin()) {
			LoginManager.login();
			return false;
		}
		//设置成window的一个全局变量
		var getOrderInfo_mem = function(){
			var url = "http://"+MT.global.path+"order_detail.cgi?v="+Math.random();
			var params = {
				"flag":MT.global.flag,
				"page_size":10,
				"page_no":1,
				"serialNo":serialNo,
				"type":"json"
			};
			$.ajax({
				url : url,
				data : params,
				type : "get",
				dataType : "script",
				timeout : 6000,
				success : function(data) {
					if(typeof(JSON_order_detail)=="undefined")
					{
						MT.global.error(MT.global.defaultMsg);
						return;
					}
					
					if(JSON_order_detail.iRet!="0")
					{
						MT.global.error(JSON_order_detail.sMsg||MT.global.defaultMsg);
						return;
					}
					//保存数据
					MT.saveOrderGoods(JSON_order_detail);
					if($.isFunction(callBack)) {
						callBack(JSON_order_detail);
					}
				},
				error : function(data) {
					MT.global.error(MT.global.defaultMsg);
				}
			});
		}
		//init
		getOrderInfo_mem();
	},
	/**
	 * 购物车数据，本地全局变量存储
	 * @param {object} list 需要存储的数据列表
	 * @return {null}  无
	 */
	saveGoods:function(list){
		//存入变量
		var saveByVar = function(){
			if($.isArray(list)||(list!=null&&typeof(list)=="object"))
			{
				var cartList = {};
				var num = 0;
				$.each(list,function(k,v){
					if(typeof(v['iNum'])=="undefined"||v['iNum']==0)
					{
						return true;
					}
					cartList[v['iSeqId']] = v;
					num++;
				});
				//MT.setCartNum(num);
				if(typeof(MT[MT.global.flag + "_Cart"])=="undefined") MT[MT.global.flag + "_Cart"] = {};
				//初始化操作list和备份数据modify
				MT[MT.global.flag + "_Cart"]['list'] = cartList;
				MT[MT.global.flag + "_Cart"]['modify'] = {};
				MT[MT.global.flag+"_Cart"]['deno_price'] = 0;//初始化折扣价
			}
			else
			{//初始化
				MT[MT.global.flag + "_Cart"] = {};
				MT[MT.global.flag + "_Cart"]["list"] = {};
				MT[MT.global.flag+"_Cart"]['deno_price'] = 0;//初始化折扣价
				JSON_cart.list = {};
			}
		}
		//cookie存储iseqid和num
		saveByVar(list);
	},
	/**
	 * 购物车数据，本地全局变量存储
	 * @param {object} list 需要存储的数据列表
	 * @return {null}  无
	 */
	saveOrderGoods:function(order){
		//存入变量
		var saveByVar = function(order){
			if($.isArray(order)||(order!=null&&typeof(order)=="object"))
			{
				MT[MT.global.flag + "_Order"] = order;
				MT[MT.global.flag+"_Order"]['deno_price'] = order.iSubPayAmount;//优惠券抵价
			}
			else
			{//初始化
				MT[MT.global.flag + "_Order"] = {};
				MT[MT.global.flag + "_Order"]["list"] = {};
				MT[MT.global.flag+"_Order"]['deno_price'] = 0;//优惠券抵价
				JSON_order.list = {};
			}
		}
		saveByVar(order);
	},
	/**
	 * 显示购物车中的道具数量
	 * @return {number}  返回购物车中的数据
	 */
	getCartNum : function() {
		if(typeof(MT[MT.global.flag + "_Cart"])!="undefined"&&typeof(MT[MT.global.flag + "_Cart"]["list"])!="undefined"){
			var num=0;
			$.each(MT[MT.global.flag + "_Cart"]["list"],function(k,v){
				num++;
			});
			return num;
		}else{
			var num = JSON_show_login.cart_num;
			if(isNaN(num)||num==null||num=="")num=0;
			return num;
		}
	},
	/**
	 *添加购物车道具
	 * @return {null}  无
	 */
	addCartItem : function(iSeqId, existMethod, callBack, num) {
		if(!LoginManager.isLogin()){
			LoginManager.submitLogin(function(){
				MT.addCartItem(iSeqId, existMethod, callBack, num);
				doLogin();
			});
			return;
		}
		var existMethod = existMethod||MT.global.existMethod;
		var addFunc_mem = function() {
			if( typeof (MT[MT.global.flag + "_Cart"]) != "undefined" && typeof(MT[MT.global.flag+"_Cart"]['list'][iSeqId]) != "undefined") {
				var msg = "该道具已在购物车内";
				if($.isFunction(existMethod))
				{
					existMethod(msg);
					return;
				}
			}
			num = num || 1;
			var url = "http://"+MT.global.path+"cart.cgi?v="+Math.random();
			var match =  /rec_info=([^&]+)/i.exec(window.location.search);
			var rec_info = match ? match[1] : '';
			var src_pos;
			var algorithm = window.algorithm||"";
			if(window.ClickStream){
				algorithm = 1000;
				src_pos = window.ClickStream.getTrace().posId || '';
			}else{
				src_pos = $.cookie("posId")||window.posId||"";
			}
			var params = {
				"flag" : MT.global.flag,
				"iSeqId" : iSeqId,
				"iNum" : num,
				"op":"add",
				"type":"json",
				"src_pos":src_pos,
				"cur_pos":typeof curPageType!="undefined"?(curPageType+"0"):"",
				"page_type":typeof curPageType!="undefined"?curPageType:"",
				"algorithm":algorithm,
				'rec_info':rec_info
			};
			$.ajax({
				url : url,
				data : params,
				type : "get",
				dataType : "script",
				timeout : 6000,
				success : function(data) {
					if(typeof(JSON_cart)=="undefined")
					{
						//console.log("cgi error");
						MT.global.error(MT.global.defaultMsg);
						return;
					}
					//购物车已满
					if(JSON_cart.iRet=="-5005")
					{
						var str = "购物车已满";
						MT.global.fullCartError(JSON_cart.sMsg||str);
						return;
					}
					else	if(JSON_cart.iRet!="0")
					{
						MT.global.error(JSON_cart.sMsg||MT.global.defaultMsg);
						return;
					}
					//MT.plusCartNum();
					MT[MT.global.flag + "_Cart"]['list'][iSeqId] = {"iSeqId":iSeqId,"iNum":num};
					//数量添加
					if($.isFunction(callBack)) {
						callBack(JSON_cart);
					}
				},
				error : function(data) {
					MT.global.error(MT.global.defaultMsg);
					//console.log(data);
				}
			});
		};
		//init 
		if( typeof(MT[MT.global.flag + "_Cart"]) == "undefined") {
			MT.getCartData(function(CartObj) {
				addFunc_mem();
			});
		}
		else
		{
			addFunc_mem();
		}
	},
	/**
	 *删除和修改了购物车的内容以后，相应的一些dq或者购物点价格，以及qb和网银价格变化；
	 * @return {null}  无
	 */
	resetCartInfo:function(){
		//通过richMT 的信息来更新价格，购物点，点券，网银打折比例
	},
	/**
	 * 删除一件物品，删除了道具信息后，付款信息会变化；
	 * @param {number} iSeqId 道具的iSeqId
	 * @param {function} notExistMethod 当这个道具不存在于购物车中时，的提示函数
	 * @param {function} callBack 删除后的回调函数
	 * @return {null}  无
	 */
	delCartItem : function(iSeqId,notExistMethod, callBack) {
		var msg = "购物车中不存在该道具";
		var delFunc_mem = function() {
			if( typeof (MT[MT.global.flag + "_Cart"]) == "undefined" || typeof(MT[MT.global.flag+"_Cart"]['list'][iSeqId]) == "undefined") {
				notExistMethod = notExistMethod||MT.global.notExistMethod;
				if($.isFunction(notExistMethod))
				{
					notExistMethod(msg);
					return;
				}
			}
			MT[MT.global.flag+"_Cart"]['modify'][iSeqId] = $.extend({},MT[MT.global.flag+"_Cart"]['list'][iSeqId]);
			//为回滚备份
			MT[MT.global.flag+"_Cart"]['modify'][iSeqId] =  MT[MT.global.flag+"_Cart"]['list'][iSeqId];
			//删除当前物品
			delete MT[MT.global.flag+"_Cart"]['list'][iSeqId];
			
			//重置购物车
			//MT.resetCartInfo();
			MT.resetCart("modify", callBack,iSeqId);
		};
		
		if( typeof(MT[MT.global.flag + "_Cart"]) == "undefined") {
			MT.getCartData(function(CartObj) {
				delFunc_mem();
			});
		}
		else
		{
			delFunc_mem();
		}
	},
	/**
	 * 批量删除购物车道具
	 * @param {string} ids 道具的iSeqId集合，通过“，”分隔
	 * @param {function} notExistMethod 如果道具不存在于购物车后的提示处理
	 * @param {function} callBack 回调函数
	 * @return {null}  无
	 */
	bathDeleteItem:function(ids,notExistMethod, callBack){
		var msg = "购物车中不存在该道具";
		var a_ids = ids.split(",");
		var delFunc_mem = function() {
			if( typeof (MT[MT.global.flag + "_Cart"]) == "undefined") {
				notExistMethod = notExistMethod||MT.global.notExistMethod;
				if($.isFunction(notExistMethod))
				{
					notExistMethod(msg);
					return;
				}
			}
			$.each(a_ids,function(k,v){
				//为回滚备份
				MT[MT.global.flag+"_Cart"]['modify'][v] =  $.extend({},MT[MT.global.flag+"_Cart"]['list'][v]);
				//删除当前物品
				delete MT[MT.global.flag+"_Cart"]['list'][v];
			});
			//重置购物车
			//MT.resetCartInfo();
			MT.resetCart("modify", callBack);
		};
		
		if( typeof(MT[MT.global.flag + "_Cart"]) == "undefined") {
			MT.getCartData(function(CartObj) {
				delFunc_mem();
			});
		}
		else
		{
			delFunc_mem();
		}
	},
	/**
	 * 修改购物车某一项道具的数量,当修改了物品数量以后，购物车总道具信息会变化（price）
	 * @param {number} iSeqId 道具的iSeqId
	 * @param {number} itemNum 物品的数量
	 * @param {function} notExistMethod 如果道具不存在于购物车后的提示处理
	 * @param {function} callBack 回调函数
	 * @return {null}  无
	 */
	modifyItemNum : function(iSeqId,itemNum,notExistMethod,callBack) {
		if(isNaN(itemNum)) return false;
		var ModifyFunc_mem = function() {
			if( typeof (MT[MT.global.flag + "_Cart"]) == "undefined" || typeof(MT[MT.global.flag+"_Cart"]['list'][iSeqId]) == "undefined") {
				var msg = "购物车中不存在该道具";
				
				notExistMethod = notExistMethod||MT.global.notExistMethod;
				
				if($.isFunction(notExistMethod))
				{
					notExistMethod(msg);
					return;
				}
			}
			//修改失败时，做回滚用
			MT[MT.global.flag+"_Cart"]['modify'][iSeqId] = $.extend({},MT[MT.global.flag+"_Cart"]['list'][iSeqId]);
			//当前物品
			MT[MT.global.flag+"_Cart"]['list'][iSeqId]['iNum'] = itemNum;
			//重置购物车
			//MT.resetCartInfo();
			MT.resetCart("modify", callBack,iSeqId);
		};
		
		if( typeof(MT[MT.global.flag + "_Cart"]) == "undefined") {
			MT.getCartData(function(CartObj) {
				ModifyFunc_mem();
			});
		}
		else
		{
			ModifyFunc_mem();
		}
	},
	/**
	 *修改物品數量操作，依赖于MT.modifyItemNum
	 * @param {number} iSeqId 道具的iSeqId
	 * @param {number} itemNum 物品的数量
	 * @param {function} notExistMethod 如果道具不存在于购物车后的提示处理
	 * @param {function} callBack 回调函数
	 * @return {null}  无
	 */
	changeGoodNumAct:function(iSeqId,op,numErrorMethod,callBack){
		var maxNum = parseInt(MT[MT.global.flag + "_Cart"]["list"][iSeqId]["iCanNum"]);
		var doAct = function(iNum){
			var msg = "",isOk = true;
			numErrorMethod = numErrorMethod||MT.global.numErrorMethod;
			switch(op)
			{
				case "+":
					iNum++;
					break;
				case "-":
					iNum--;
					break;
				default:
					if(isNaN(op)){
						isOk = false;
						msg = "操作参数错误";
					}else{
						iNum = op;
					}
					break;
			}
			
			if(iNum > maxNum) {
				msg = "该道具单次最多购买"+maxNum+"件!";
				isOk = false;
			}
			else if( iNum <= 0) {
				msg = "不能再减了!";
				isOk = false;
			}
			
			if(isOk)
			{
				MT.modifyItemNum(iSeqId,iNum,MT.global.notExistMethod,callBack);
			}
			else
			{
				numErrorMethod(msg);
				return 
			}
		};
		var changeAct_mem = function(){
			var iNum = parseInt(MT[MT.global.flag + "_Cart"]["list"][iSeqId]["iNum"]);
			doAct(iNum);
		};
		
		if( typeof(MT[MT.global.flag + "_Cart"]) == "undefined") {
			MT.getCartData(function(CartObj) {
				changeAct_mem();
			});
		}
		else
		{
			changeAct_mem();
		}
	},
	/**
	 * 清空购物车
	 * @param {function} callBack 回调函数
	 * @return {null}  无
	 */
	emptyCart:function(callBack){
		MT[MT.global.flag + "_Cart"]['list'] = {}; 
		MT.resetCart("clear", callBack);
	},
	/**
	 * 查询点券
	 * @param {string} iZone 大区id
	 * @param {string} lRoleId 角色id
	 * @param {function} callback 回调函数
	 * @return {null}  无
	 */
	getDQNum : function(iZone, lRoleId,callback) {
		if(!iZone || iZone == "") {
			return;
		}
		var lRoleId = lRoleId||"";
		var url = "http://"+MT.global.path+"show_dq.cgi?flag="+MT.global.flag+ "&iZone=" + iZone + "&iRoleId=" + lRoleId + "&t=" + Math.random();
		$.getScript(url,function(){
				try {
					if(JSON_show_dq && JSON_show_dq.iRet == 0) {
						MT[MT.global.flag + "_dqno"] = JSON_show_dq.iDianQuan;
						if($.isFunction(callback)){
							callback(MT[MT.global.flag + "_dqno"]);
						}
					}else{
						MT[MT.global.flag + "_dqno"] = 0;
					}
				} catch(e) {
					//console.log(e);
				};
		});
	},
	/**
	 * 购物点查询
	 * @param {function} callback 回调函数
	 * @return {null}  无
	 */
	getGWQNum:function(callback){
		var url = "http://apps.game.qq.com/cgi-bin/daoju/show_login.cgi?flag="+MT.global.flag+ "&ticket=1&t=" + Math.random();
		$.getScript(url,function(){
				try {
					if(JSON_show_login && JSON_show_login.iRet == 0) {
						MT[MT.global.flag + "_gwqno"] = JSON_show_login.ticket;
						if($.isFunction(callback)){
							callback(MT[MT.global.flag + "_gwqno"]);
						}
					}
				} catch(e) {
					//console.log(e);
				};
		});
	},
	/**
	 * 添加浏览历史
	 * @param {number} id 道具的iSeqId
	 * @param {string} name 道具的名称
	 * @param {string} pic 道具的图片地址
	 * @param {number} qb 道具的价格，qb为单位
	 * @return {null}  无
	 */
	addLAG:function(id,name,pic,qb){
		var obj = {"id":id,"name":name,"pic":pic,"qb":qb,"flag":globalvar.flag};
		var lags = this.getLAG()||[];
		var exists = false;
		$.each(lags,function(k,v){
			if(id==v.id){
				exists = true;
				return false;
			} 
		});
		if(!exists)
			lags.push(obj);
		if(lags.length>4)
			lags.shift();
		var str = $.json2string(lags);
		$.cookie(MT.global.flag+"_lag",str,{"path":"/"+globalvar.flag+"/"});
	},
	/**
	 * 清空浏览历史
	 * @return {null}  无
	 */
	clearLAG:function(){
		$.cookie(MT.global.flag+"_lag",'',{"expires":-1,"path":"/"+globalvar.flag+"/"});
	},
	/**
	 * 获取浏览道具的数据列表
	 * @return {object}  浏览道具的信息列表
	 */
	getLAG:function(){
		var lags = $.cookie(MT.global.flag+"_lag");
		if(lags){
			lags = lags.replace('<', '&lt;');
			lags = lags.replace('>', '&gt;');
			if(lags.indexOf('script') >= 0){
				lags = null;
			}
		}
		
		return $.parseJSON(lags);
	},
	/**
	 * 获取用户的登录信息
	 * @param {function} callback 回调函数
	 * @return {null}  无
	 */
	getLoginInfo:function(callback,option){
		var def_set = {
				flag:MT.global.flag
				//vip
				//now
		};
		option = $.extend({},def_set,option);
		var url = "http://apps.game.qq.com/cgi-bin/daoju/show_login.cgi?type=json&"+$.param(option)+"&t=" + Math.random();
		$.getScript(url,function(){
			if(typeof(JSON_show_login)!="undefined")
			{
				if(typeof(JSON_show_login.ticket)!="undefined")
				{
					MT[MT.global.flag + "_gwqno"] = JSON_show_login.ticket;
					$('#header_judou').html(JSON_show_login.ticket);
					$('#con_judou').html(JSON_show_login.ticket);
				}
				
				if(typeof(JSON_show_login.vip)!="undefined")
				{
					MT[MT.global.flag + "_isvip"]  = JSON_show_login.vip;
				}
				
				if($.isFunction(callback))
				{
					callback(JSON_show_login);
				}
			}
		});
	},
	/**
	 * 获取当前用户的优惠券列表
	 * @param {function} succ 成功后的回调函数
	 * @param {function} failed 失败后的回调函数
	 * @return {null}  无
	 */
	getYhqList:function(succ,failed){
		//显示未使用优惠券
		//var page_size = MT.global.flag == 'cf' ? 100 : 50; 
		var page_size = 50;
		var url = "http://"+MT.global.path+"show_coupon.cgi?flag="+MT.global.flag+"&page_no=1&page_size="+page_size+"&iState=0&r="+Math.random();
		$.getScript(url,function(){
			JSON_show_coupon = typeof(JSON_show_coupon)=="undefined"?{}:JSON_show_coupon;
			var yhq_list = $.parseData(JSON_show_coupon.list);
			if((!yhq_list)||yhq_list.length==0)
			{
				if($.isFunction(failed))
				{
					failed(yhq_list);
				}
				return false;
			}
			if($.isFunction(succ))
			{
				succ(yhq_list);
			}
		});
	},
	/**
	 * 转换道具信息
	 * @param {object} dataList 需要转换的道具数据列表
	 * @return {object} 返回转换后的道具信息
	 */
	parseGoodsData : function(dataList) {
		var dataNewList = [];
		$.each(dataList,function(k,v){
			var tmp = {};
			$.extend(tmp, {
				priceOrgQB : "",
				priceOrgQP : "",
				priceVipQB : "",
				priceVipQP : ""
			});
			var tmp_price = v["iPrice"];
			tmp["iDisPrice"] = MT.Unit.transDiscountPrice(v["iPrice"], v["iDiscount"], v["dtDiscountBegin"], v["dtDiscountEnd"],v["iDisCntPrice"]);
			tmp["isDisCount"] = v["iPrice"]==tmp["iDisPrice"]?false:true;
			tmp["iVipPrice"] = MT.Unit.transDiscountPrice(v["iVipPrice"], v["iDiscount"], v["dtDiscountBegin"], v["dtDiscountEnd"],v["iDisCntPrice"]);
			tmp["priceActQB"] = MT.Unit.transQbPrice(tmp["iDisPrice"]);
			tmp["priceQB"] = MT.Unit.transQbPrice(v["iPrice"]);
			tmp["priceDisQB"] = MT.Unit.transQbPrice(tmp["iDisPrice"]);
			tmp["priceActQP"] = MT.Unit.transQpPrice(tmp["iDisPrice"]);
			tmp["priceActTicket"] = MT.Unit.transTicketPrice(tmp["iDisPrice"]);
			tmp["priceVipQB"] = MT.Unit.transQbPrice(tmp["iVipPrice"]);
			tmp["priceBankQB"] = MT.Unit.transBankPrice(tmp["iDisPrice"]);
			// tmp["priceTenpayBankQB"] = MT.Unit.transTenpayBankPrice(v["iPrice"]);
			tmp["priceTenpayBankQB"] = MT.Unit.transTenpayBankPrice(tmp["iDisPrice"]);
			tmp["priceVipQP"] = MT.Unit.transQpPrice(tmp["iVipPrice"]);
			tmp["priceOrgQB"] = MT.Unit.transQbPrice(v["iOrgPrice"]);
			tmp["priceOrgQP"] = MT.Unit.transQpPrice(v["iOrgPrice"]);
			//tmp["iTicketBack"] = MT.Unit.transTicketPrice(v["iTicketBack"]);
            tmp["payPriceQB"] = MT.Unit.transQbPrice(v["iPayPrice"]);//但道具价格*其数量
			tmp["isBackGWQ"] = v['iTicketBack']?"是":"否";
			
			if(tmp['isDisCount'])
			{
				tmp["yh_class"] = "ico_limit";
			}
			if(typeof(JSON_show_login)!="undefined"){
				if(JSON_show_login.vip=="1"){
					tmp["yh_class"] = "ico_vip";
					tmp["priceDisQB"] = tmp["priceVipQB"];
				}
			}
			//道具物品类型
			if( typeof (goodTypes) != "undefined") {
				if( typeof (goodTypes[v["iType"]]) != "undefined")
					tmp["sType"] = goodTypes[v["iType"]]['sTypeName'];
			}
			
			if(v["sTime"])tmp["timeLimitDesc"] = MT.Unit.transTimeLimit(v["sTime"].split("|")[0]);
			if(v["sGoodsName"])tmp["sGoodsName"] = unescape(v["sGoodsName"]).split("|")[0].toHtml();
			if(v["sGoodsPic"]) tmp["sGoodsPic"] = unescape(v["sGoodsPic"]).split("|")[0];
			if(globalvar.flag == 'speed' || globalvar.flag == 'r2' || globalvar.flag == 'x5'){
				if(v["sActionName"] == 'VIP优惠') tmp["sActionName"] = '紫钻优惠';
			}
			dataNewList.push($.extend({},v,tmp));
		});
		
		return dataNewList;
	},
	/**
	 * @author haryli 
	 * @version 2.0
	 * @date 2012-12-15 
	 * @class Core.MT.Unit  
	 * <p>
	 * 方法集主要包括：字段换算方法集合<br/>
	 * </p>
	 */
	Unit:{
		/**
		 * 期限转换（把期限id转换成字符串）
		 * @param {number} showType 期限id
		 * @return {object} 返回转换后期限
		 */
		transTimeLimit : function(showType) {
			if( typeof showType != "number")
				showType = parseInt(showType);
			if(typeof(dateTypes[showType])=="undefined"){
				return "无期限";
			}else{
				return dateTypes[showType]['sTimeDesc'];
			}
		},
		/**
		 * 把Q分转换成QB价格
		 * @param {number} price Q分
		 * @return {object} 返回转换后的价格
		 */
		transQbPrice : function(price) {
			var s_num = (price / 100).toFixed(10) + "";
			return s_num.substring(0,s_num.indexOf(".")<0?s_num.length:(s_num.indexOf(".")+3)); 
		},
		/**
		 * 把Q分转换成QP价格
		 * @param {number} price Q分
		 * @return {object} 返回转换后的价格
		 */
		transQpPrice : function(price) {
			var s_num = (price / 10).toFixed(10) + "";
			return s_num.substring(0,s_num.indexOf(".")<0?s_num.length:(s_num.indexOf(".")+3)); 
		},
		/**
		 *  购物券价格转化
		 * @param {number} price Q分
		 * @return {object} 返回转换后的价格
		 */
		transTicketPrice : function(price, fixed) {
			if(isNaN(price))price = 0;
			var fixed = ( typeof (fixed) == "undefined") ? ( typeof (globalvar.transTicketRelate) != "undefined" ? 2 : 0) : parseInt(fixed);
			var transTicketRelate = typeof (globalvar.transTicketRelate) == "undefined" ? 100 : parseFloat(globalvar.transTicketRelate);
			var s_num = ((price*transTicketRelate)/100).toFixed(10) + "";
			var isFloat = s_num.indexOf(".")!=-1;
			if(fixed==0){
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed):s_num;
			}else{
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed+1):s_num;
			}
		},
		/**
		 *  网银价格转化
		 * @param {number} price Q分
		 * @return {object} 返回转换后的价格
		 */
		transBankPrice : function(price, fixed) {
			if(!globalvar.bankRebate&&(!globalvar.pay_type||!globalvar.pay_type.bank)){
				return 0;
			}
			if(isNaN(price))price = 0;
			var discount = typeof (globalvar.pay_type) != "undefined"?globalvar.pay_type.bank.discount:globalvar.bankRebate;
			var fixed = ( typeof (fixed) == "undefined") ? ( typeof (discount) != "undefined" ? 2 : 0) : parseInt(fixed);
			var bankRebate = typeof (discount) == "undefined"||discount=="" ? 100 : parseFloat(discount);
			var s_num = ((price*bankRebate)/10000).toFixed(10) + "";
			var isFloat = s_num.indexOf(".")!=-1;
			if(fixed==0){
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed):s_num;
			}else{
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed+1):s_num;
			}
		},
		transTenpayBankPrice:function(price, fixed){
			if(!globalvar.tenpayBankRebate&&(!globalvar.pay_type||!globalvar.pay_type.tenpaybank)){
				return 0;
			}
			if(isNaN(price))price = 0;
			var discount = typeof (globalvar.pay_type) != "undefined"?globalvar.pay_type.tenpaybank.discount:globalvar.tenpayBankRebate;
			var fixed = ( typeof (fixed) == "undefined") ? ( typeof (discount) != "undefined" ? 2 : 0) : parseInt(fixed);
			var bankRebate = typeof (discount) == "undefined"||discount=="" ? 100 : parseFloat(discount);
			var s_num = ((price*bankRebate)/10000).toFixed(10) + "";
			var isFloat = s_num.indexOf(".")!=-1;
			if(fixed==0){
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed):s_num;
			}else{
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed+1):s_num;
			}
		},
		/**
		 *  人民币价格转化
		 * @param {number} price Q分
		 * @return {object} 返回转换后的rmb价格
		 */
		transRmbPrice : function(price) {
			var s_num = (price / 100).toFixed(10) + "";
			return s_num.substring(0,s_num.indexOf(".")<0?s_num.length:(s_num.indexOf(".")+3)); 
		},
		/**
		 *  点券价格转化
		 * @param {number} price Q分
		 * @return {object} 返回转换后的dq价格
		 */
		transDqPrice : function(price,fixed) {
			if(isNaN(price))price = 0;
			var fixed = ( typeof (fixed) == "undefined") ? ( typeof (globalvar.dqRelate) != "undefined" ? 2 : 0) : parseInt(fixed);
			var dqRelate = typeof (globalvar.dqRelate) == "undefined" ? 100 : parseFloat(globalvar.dqRelate);
			var s_num = ((price*dqRelate)/100).toFixed(10) + "";
			var isFloat = s_num.indexOf(".")!=-1;
			if(fixed==0){
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed):s_num;
			}else{
				return isFloat?s_num.substring(0,s_num.indexOf(".")+fixed+1):s_num;
			}
		},
		/**
		 *  限时折扣处理
		 * @param {number} price Q分
		 * @return {object} 返回转换后的qb价格
		 */
		transDiscountPrice : function(price, discount, timebegin, timeend,iDisCntPrice) {
			if(typeof(timebegin)=="undefined"){
				return parseInt(price);
			}
			var timenow = 'undefined' != typeof (JSON_sys_time)&&JSON_sys_time.iRet == "0"?JSON_sys_time.sMsg:$.date("Y-m-d H:i:s");
			var start = new Date(timebegin.substr(0, 4), timebegin.substr(5, 2) - 1, timebegin.substr(8, 2), timebegin.substr(11, 2), timebegin.substr(14, 2), timebegin.substr(17, 2));
			var end = new Date(timeend.substr(0, 4), timeend.substr(5, 2) - 1, timeend.substr(8, 2), timeend.substr(11, 2), timeend.substr(14, 2), timeend.substr(17, 2));
			var now = new Date(timenow.substr(0, 4), timenow.substr(5, 2) - 1, timenow.substr(8, 2), timenow.substr(11, 2), timenow.substr(14, 2), timenow.substr(17, 2));

			if(start < now && end >= now) {
				if(iDisCntPrice==0||typeof(iDisCntPrice)=="undefined"){
					return price * discount / 100;
				}else{
					return Math.min(price,iDisCntPrice);
				}
			} else {
				return price;
			}
			return price;
		}
	}
});
/*  |xGv00|aa039befd1ab26ee164af0454e7c5027 */