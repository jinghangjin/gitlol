/**
 * @author haryli 
 * @version 2.0
 * @date 2012-12-14 
 * @class Core.MT
 * <pre><code>
 * scode:
 * 1000 ������ȫ�ֱ�������δ����
 * 1001 ��������������״̬��Ϊ0
 * 1002 �������⵼��
 * 
 * servercode:
 * -5005 ���ﳵ����
 * </code></pre>
 * <p>
 * ��js���̳ǵĺ���ҵ���<br/>
 * ��������Ҫ���������۳�ҵ�����й��ڲ�cgi���ݵ��ú�ҳ����Ⱦ�ķ�������������Ҫ�������ﳵ���ݲ�������ɫ��Ϣ��ѯ��<br/>
 * ���������з������󶨵�MT�����У���ֱ��ʹ��MT.method���á�<br/>
 * </p>
 * SVN: $Id: dj_co.js 36815 2014-07-01 03:48:47Z haryli $
 */

if( typeof (MT) == "undefined") {
	/**
	 * @cfg {object} MT ���۳�ҵ���������ʵ��
	 * Ĭ�����ã�
	 * <pre><code>
	 * //ȫ��Ĭ������
	 * MT = {
					global:{
						existMethod:function(msg){
							alert(msg)
						},//���ﳵ�Ѵ��ڸõ��ߵ���ʾ����
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
						//�޸�������Ĭ��ȫ�ֺ���
						numErrorMethod:function(msg){
							alert(msg);
						},
						defaultMsg:"�ܱ�Ǹ�������ڷ��ʵ��������࣬ϵͳ��æ�����Ժ�����~"
					},
					setGlobalOption:function(option){
						this.global = $.extend(this.global,option||{});
					}		
				}
	 * </code></pre>
	 */
	MT = {
			//ȫ��Ĭ������
			global:{
				existMethod:function(msg){
					alert(msg)
				},//���ﳵ�Ѵ��ڸõ��ߵ���ʾ����
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
				//�޸�������Ĭ��ȫ�ֺ���
				numErrorMethod:function(msg){
					alert(msg);
				},
				defaultMsg:"�ܱ�Ǹ�������ڷ��ʵ��������࣬ϵͳ��æ�����Ժ�����~"
			},
			setGlobalOption:function(option){
				this.global = $.extend(this.global,option||{});
			},
			cur_paytype:"qpqb"//Ĭ�ϵ�ǰ֧��������
	};

	globalvar.transTicketRelate = globalvar.flag == 'r2' ? 1 : 0.01;//��ʱ�������̨���ߺ�ɾ��

	MT['cart_discount'] = {};
	MT['cart_discount']['use_ticket'] = true;
	MT['cart_discount']['use_coupon'] = globalvar.hasYhq > 0 ? true : false;
	MT['cart_discount']['ticket'] = '';//������������ʹ��ʱΪ��
	MT['cart_discount']['max_ticket'] = 0;//���ʹ�ù��������
	MT['cart_discount']['coupon_id'] = '';//�Ż�ȯid����ʹ��ʱΪ��
	MT['cart_discount']['dq'] = 0;//ʹ�õ�ȯ
	
}

function cartPrice(option){//���뵥λ��Ϊ '��'
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

		if(globalvar.flag=='dnf'){//ֻ��dnfʹ�õ�ȯ
			$('#js_real_QB_area').hide();
			$('#price_info').hide();
			$('#js_real_DQ_area').show().find('#js_real_DQ').html(this.total);
			$('#dnf_real_last_QB').html(this.total);//��ȯ�ܶ�
			$('#dnf_recharge_QB').html(Math.ceil(totalQb - dqQb));//������ٵ�ȯ,100��������
			$('#dnf_real_last_QB_2').html(this.total);//��ȯ�ܶ�
			return;
		}

		$('#js_real_QB').html(parseFloat(real).toFixed(2));
		//console.log('cartprice', ''+this.total+'----'+this.coupon+'-----'+this.ticket);
		var priceInfo = [];
		if(couponQb > 0 || ticketQb > 0){
			priceInfo.push('�ܼ�:<span id="js_total_QB" class="font_red_b">'+parseFloat(totalQb).toFixed(2)+'</span>');
			couponQb > 0 && priceInfo.push('- �Ż�ȯ:<span id="js_yhq_QB" class="font_red_b">'+parseFloat(couponQb).toFixed(2)+'</span>');
			ticketQb > 0 && priceInfo.push('-�����:<span id="js_gwd_QB" class="font_red_b">'+parseFloat(ticketQb).toFixed(2)+'</span>');
			priceInfo.push(' = ');
			$('#price_info').html(priceInfo.join('')).show();
		}else{
			$('#price_info').hide();
		}
		SpeedFeedBack.set(real);
		OrderGift.set(real*100);
	};
}
 //��������
function orderGift(){//price ��λ�� ��
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
							goodsNames.push('��'+this.sGoodsName+'��');
						}
					});
					if(goodsNames.length){
						tmpHtml.push('<div class="cart_total_box clear" style="margin-top:16px; background-color:white;">');
						tmpHtml.push('<div style="background-color:red;color:white;font-size:110%;line-height:23px;width:45px;text-align:center;float:left;margin-top:6px;margin-left:5px;">����</div>');
						tmpHtml.push('<div style="width: 20px; height: 22px; float: left; background: url(&quot;http://js01.daoju.qq.com/common/images/channel/ordergift_beep.png&quot;) no-repeat scroll 0px 0px transparent;margin-top:7px;margin-left:10px"></div>');
						tmpHtml.push('<div style="float:left;color:#9C9C9C;font-weight:bolder;margin-left:10px;">�����ػݣ�'+(isSuccess ? '��ϲ�����' : '')+'</div>');
						tmpHtml.push('<div style="float:left;color:red;">'+(isSuccess ? '' : '������'+parseFloat(this.pay_amount_min/100).toFixed(2)+'Q�ң���'));
						tmpHtml.push('<span style="font-weight:bolder;">');
						tmpHtml.push(goodsNames.join(''));
						tmpHtml.push('</span>���ֹʱ��:'+that.data.end_time+'</div>');
						tmpHtml.push('<div style="float:left;color:#9C9C9C;margin-left:10px;">�������ʵ����Ϊ׼��</div>');
						tmpHtml.push('</div>');
					}
					html = tmpHtml;
				}
			});
		}
		
		$('#award_list').html(html.join(''));
	};
}

//speed����ֵ�ͻ�����
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
//�����ͳ��
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
//ʵ����չ
$.extend(MT, {
	initCartDiscountBlock:function(){
		if(JSON_show_login !== undefined && JSON_show_login.ticket > 0){
			MT['cart_discount']['use_ticket'] = true;
		}else{
			MT['cart_discount']['use_ticket'] = false;
		}
		
//		MT['cart_discount']['use_coupon'] = globalvar.hasYhq > 0 ? true : false;
		MT['cart_discount']['ticket'] = '';//������������ʹ��ʱΪ��
		MT['cart_discount']['coupon_id'] = '';//�Ż�ȯid����ʹ��ʱΪ��
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
	 * ��ҳ���Ź���
	 * @param {string} selector jQuery ѡ���� 
	 * @return {null} ��
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
	 * ���۳���ҳ����������
	 * @param {string} tplid html domԪ��id
	 * @return {null} ��
	 */
	makeMoneyRank:function(tplid){
		var url = "http://daoju.qq.com/time/market/js/"+globalvar.flag+"/MoneyRank.js"
		$.getScript(url,function(){
			if(typeof(MoneyRank)=="undefined"){
				//ϵͳ��æ���Ժ�����
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
	 * �û���ɫ��Ϣ��ѯ
	 * @param {string} zone ����id
	 * @param {string} uin �û�QQ��
	 * @param {function} callback �ص�����
	 * @return {null} ��
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
	 * ��ע������Ϣ
	 * @param {object} option 
	 * Ĭ���ֶ��У�
	 * <pre><code>
	  {
				"iGoodsSeqId":"", 	//��Ʒid
				"content":"",			//��ע��������Ϣ
				"location":"",			//��ע��Դ
				"url":"",					//ҳ���ַ
				"iActId":"",				//�Ի�Ǹ��ļ����Դ����ǻ�ɲ���
				"sGoodsName":"", //��������
				"tiptime":"",			   //tip������ʾʱ��
				"sActName":"",	   //�����
				"piclink":""			  //����ͼƬ��ַ
		}
	 </code></pre>
	 * @param {function} callback �ص�����
	 * @return {bool} ȡ���������Ĭ���¼�
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
	 * ΢������
	 * @param {function} callback �ص�����
	 * @return {bool} ȡ���������Ĭ���¼�
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
	 * �Ƿ���vip
	 * @param {object} option �ص�����
	 * Ĭ�ϲ�����
	 * <pre><code>
	    {
				"callback":null,//�ص�����
				"vip":""			//vip���ͣ�����blue(�����Ա),qq(QQ��Ա)...
		}
	 </code></pre>
	 * @return {null} ��
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
	 * �����б�ͨ�ò�ѯ��ҳ��չʾ����ģ��
	 * @param {object} option �ص�����
	 * Ĭ�ϲ�����
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
	 * @return {null} ��
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
		//Ĭ�Ϸ�ҳ��С
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
				"prev":"<em class=prv_off_icon></em>��һҳ",
	            "next":"��һҳ<em class=next_on_icon></em>",
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
						//���ģ��
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
				//���ݴ���cnt
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
				//���ģ��
				$.fillListTpl(option.tplId,list,function(data){
					//��ҳ����
					if( typeof ($.fn.jpage) === "undefined") {
						$.getScript("http://ossweb-img.qq.com/images/gameshop/ui/page/page_1.js", function(option) {
								makePage(cnt,1);
						});
					} else {
						makePage(cnt,1);
					}
					//�ص�
					option.success(data);
				},true,tpl_html);
			}
			else
			{
				//��ʱ����
				option.error(json_p);
			}
		});
	},
	/**
	 * ��ȡ��ע��Ϣ
	 * @param {number} pn ��ǰҳ��
	 * @param {number} ps ÿҳ��ʾ������
	 * @param {function} callback �ص�����
	 * @return {object} �����ҹ�ע�ĵ�����Ϣ�б�
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
	 * ��ʼ����ʾ�������
	 * @return {null} ��
	 */
	initLAG:function(){
		var datalist = MT.getLAG();
		$.fillListTpl("lag_list",datalist,null,false);
		$("#clear_history").click(function(){
			if(confirm("ȷ��Ҫ��������ʷô��")){
				MT.clearLAG();
				$("#lag_list").stop().animate({height:0,opacity:0},300,function(){
					$(this).empty();
				});
			}
			return false;
		});
	},
	/**
	 * �����Ʒ�����ﳵ
	 * @param {number} iSeqId ��Ʒ��seqid
	 * @param {number} num  ��Ʒ������
	 * @param {bool} directBuy �Ƿ���ֱ����Ĭ����false
	 * @param {number} price
	 * @return {null} ��
	 */
	buyGood:function(iSeqId,num,directBuy){
		directBuy = directBuy||false;
		var num = num||1;
		if(!iSeqId) return;
		MT.addCartItem(iSeqId,null,function(data){
			var cartUrl = "/"+globalvar.flag+"/buy2.shtml";
			if(directBuy){
				new Boxy("<p style='text-align:center;'>�Ѿ���ӵ����ﳵ<a style='color:#0069B5' href='"+cartUrl+"' >���ҹ���ĵ��ߡ�</a></p>",{title:"��ܰ��ʾ",closeText:" ",modal:true});
			}else{
				Boxy.ask("<p>�õ����Ѿ��ɹ�����ӵ����Ĺ��ﳵ��</p>", ['��������', '���빺�ﳵ'], function(response) {
					if(response == '���빺�ﳵ'){
						location.href = cartUrl;
					}else{
						$(".gwc_num").html(MT.getCartNum());
					}
				}, {title:"��ܰ��ʾ",closeText:" "});
			}
			//�������Ͻǹ��ﳵ����
			$(".gwc_num").html(MT.getCartNum());
		},num);
	},
	/**
	 * ���ù��ﳵ����
	 * @param {string} act ������ʽ��
	 * <pre>
	 * modify:ɾ��ĳ�����ߣ������޸ĵ��ߵ�����
	 * add:��ӹ��ﳵ���ߣ�
	 * clear:��չ��ﳵ��
	 * show:��ʾ���ﳵ���ݣ�
	 * <pre>
	 * @param {function} callBack  �ص�����
	 * @param {number}  curISeqId ��ǩ���ߵ�iSeqId
	 * @return {null} ��
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
					//�ع�֮ǰ�Ĳ�������
					$.each(MT[MT.global.flag+"_Cart"]['modify'],function(k,v){
						MT[MT.global.flag+"_Cart"]['list'][k] = v;
					});
					//����modify
					MT[MT.global.flag+"_Cart"]['modify'] = {};
					MT.global.error(JSON_cart.sMsg||MT.global.defaultMsg);
					//console.log(JSON_cart.sMsg);
					return;
				}
				//ɾ���ɹ���ձ���
				MT[MT.global.flag+"_Cart"]['modify'] = {};
				if($.isArray(JSON_cart.list))
				{
					var cartList = {};
					var num = 0;
					$.each(JSON_cart.list,function(k,v){
						//����۸����޸ģ���ô��Ҫ��ʾ�û�ˢ��ҳ��
						if(typeof(MT[MT.global.flag + "_Cart"]['list'][v['iSeqId']])!="undefined"&&typeof(v['iPrice'])!="undefined")
						{
							if(v['iPrice']!=MT[MT.global.flag + "_Cart"]['list'][v['iSeqId']]['iPrice'])
							{
								if(confirm("\""+v['sGoodsName']+"\"�۸��б䶯���Ƿ�ˢ��ҳ��"))
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
	 * ��ȡ���ﳵ���е��ߵļ۸��ܺͣ����ۻ�vip�ۿۺ�ļ۸�
	 * @return {number} �����ܼ�
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
	 * ��ȡ���ﳵ���е��ߵļ۸��ܺͣ�ԭ���ܺͣ��������ۿۻ��㣩
	 * @return {number} �����ܼ�
	 */
	getTotalUnDisPrice:function(){
		var total_info = typeof(JSON_cart)!="undefined"?JSON_cart:JSON_order_detail;
        return total_info.total_pay_price;
	},
	/**
	 * ��ȡ���ﳵ�����б�
	 * @param {function} callBack �ص�����
	 * @return {null}  ��
	 */
	getCartData : function(callBack,areaid) {
		if(!LoginManager.isLogin()) {
			LoginManager.login();
			return false;
		}
		//���ó�window��һ��ȫ�ֱ���
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
					//��������
					MT.saveGoods(JSON_cart.list);
					//�Ƿ���Ҫvip,Ĭ��Ϊ
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
	 * ��ȡ���������б�
	 * @param {function} callBack �ص�����
	 * @return {null}  ��
	 */
	getOrderData : function(serialNo,callBack) {
		if(!LoginManager.isLogin()) {
			LoginManager.login();
			return false;
		}
		//���ó�window��һ��ȫ�ֱ���
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
					//��������
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
	 * ���ﳵ���ݣ�����ȫ�ֱ����洢
	 * @param {object} list ��Ҫ�洢�������б�
	 * @return {null}  ��
	 */
	saveGoods:function(list){
		//�������
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
				//��ʼ������list�ͱ�������modify
				MT[MT.global.flag + "_Cart"]['list'] = cartList;
				MT[MT.global.flag + "_Cart"]['modify'] = {};
				MT[MT.global.flag+"_Cart"]['deno_price'] = 0;//��ʼ���ۿۼ�
			}
			else
			{//��ʼ��
				MT[MT.global.flag + "_Cart"] = {};
				MT[MT.global.flag + "_Cart"]["list"] = {};
				MT[MT.global.flag+"_Cart"]['deno_price'] = 0;//��ʼ���ۿۼ�
				JSON_cart.list = {};
			}
		}
		//cookie�洢iseqid��num
		saveByVar(list);
	},
	/**
	 * ���ﳵ���ݣ�����ȫ�ֱ����洢
	 * @param {object} list ��Ҫ�洢�������б�
	 * @return {null}  ��
	 */
	saveOrderGoods:function(order){
		//�������
		var saveByVar = function(order){
			if($.isArray(order)||(order!=null&&typeof(order)=="object"))
			{
				MT[MT.global.flag + "_Order"] = order;
				MT[MT.global.flag+"_Order"]['deno_price'] = order.iSubPayAmount;//�Ż�ȯ�ּ�
			}
			else
			{//��ʼ��
				MT[MT.global.flag + "_Order"] = {};
				MT[MT.global.flag + "_Order"]["list"] = {};
				MT[MT.global.flag+"_Order"]['deno_price'] = 0;//�Ż�ȯ�ּ�
				JSON_order.list = {};
			}
		}
		saveByVar(order);
	},
	/**
	 * ��ʾ���ﳵ�еĵ�������
	 * @return {number}  ���ع��ﳵ�е�����
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
	 *��ӹ��ﳵ����
	 * @return {null}  ��
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
				var msg = "�õ������ڹ��ﳵ��";
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
					//���ﳵ����
					if(JSON_cart.iRet=="-5005")
					{
						var str = "���ﳵ����";
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
					//�������
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
	 *ɾ�����޸��˹��ﳵ�������Ժ���Ӧ��һЩdq���߹����۸��Լ�qb�������۸�仯��
	 * @return {null}  ��
	 */
	resetCartInfo:function(){
		//ͨ��richMT ����Ϣ�����¼۸񣬹���㣬��ȯ���������۱���
	},
	/**
	 * ɾ��һ����Ʒ��ɾ���˵�����Ϣ�󣬸�����Ϣ��仯��
	 * @param {number} iSeqId ���ߵ�iSeqId
	 * @param {function} notExistMethod ��������߲������ڹ��ﳵ��ʱ������ʾ����
	 * @param {function} callBack ɾ����Ļص�����
	 * @return {null}  ��
	 */
	delCartItem : function(iSeqId,notExistMethod, callBack) {
		var msg = "���ﳵ�в����ڸõ���";
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
			//Ϊ�ع�����
			MT[MT.global.flag+"_Cart"]['modify'][iSeqId] =  MT[MT.global.flag+"_Cart"]['list'][iSeqId];
			//ɾ����ǰ��Ʒ
			delete MT[MT.global.flag+"_Cart"]['list'][iSeqId];
			
			//���ù��ﳵ
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
	 * ����ɾ�����ﳵ����
	 * @param {string} ids ���ߵ�iSeqId���ϣ�ͨ���������ָ�
	 * @param {function} notExistMethod ������߲������ڹ��ﳵ�����ʾ����
	 * @param {function} callBack �ص�����
	 * @return {null}  ��
	 */
	bathDeleteItem:function(ids,notExistMethod, callBack){
		var msg = "���ﳵ�в����ڸõ���";
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
				//Ϊ�ع�����
				MT[MT.global.flag+"_Cart"]['modify'][v] =  $.extend({},MT[MT.global.flag+"_Cart"]['list'][v]);
				//ɾ����ǰ��Ʒ
				delete MT[MT.global.flag+"_Cart"]['list'][v];
			});
			//���ù��ﳵ
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
	 * �޸Ĺ��ﳵĳһ����ߵ�����,���޸�����Ʒ�����Ժ󣬹��ﳵ�ܵ�����Ϣ��仯��price��
	 * @param {number} iSeqId ���ߵ�iSeqId
	 * @param {number} itemNum ��Ʒ������
	 * @param {function} notExistMethod ������߲������ڹ��ﳵ�����ʾ����
	 * @param {function} callBack �ص�����
	 * @return {null}  ��
	 */
	modifyItemNum : function(iSeqId,itemNum,notExistMethod,callBack) {
		if(isNaN(itemNum)) return false;
		var ModifyFunc_mem = function() {
			if( typeof (MT[MT.global.flag + "_Cart"]) == "undefined" || typeof(MT[MT.global.flag+"_Cart"]['list'][iSeqId]) == "undefined") {
				var msg = "���ﳵ�в����ڸõ���";
				
				notExistMethod = notExistMethod||MT.global.notExistMethod;
				
				if($.isFunction(notExistMethod))
				{
					notExistMethod(msg);
					return;
				}
			}
			//�޸�ʧ��ʱ�����ع���
			MT[MT.global.flag+"_Cart"]['modify'][iSeqId] = $.extend({},MT[MT.global.flag+"_Cart"]['list'][iSeqId]);
			//��ǰ��Ʒ
			MT[MT.global.flag+"_Cart"]['list'][iSeqId]['iNum'] = itemNum;
			//���ù��ﳵ
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
	 *�޸���Ʒ����������������MT.modifyItemNum
	 * @param {number} iSeqId ���ߵ�iSeqId
	 * @param {number} itemNum ��Ʒ������
	 * @param {function} notExistMethod ������߲������ڹ��ﳵ�����ʾ����
	 * @param {function} callBack �ص�����
	 * @return {null}  ��
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
						msg = "������������";
					}else{
						iNum = op;
					}
					break;
			}
			
			if(iNum > maxNum) {
				msg = "�õ��ߵ�����๺��"+maxNum+"��!";
				isOk = false;
			}
			else if( iNum <= 0) {
				msg = "�����ټ���!";
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
	 * ��չ��ﳵ
	 * @param {function} callBack �ص�����
	 * @return {null}  ��
	 */
	emptyCart:function(callBack){
		MT[MT.global.flag + "_Cart"]['list'] = {}; 
		MT.resetCart("clear", callBack);
	},
	/**
	 * ��ѯ��ȯ
	 * @param {string} iZone ����id
	 * @param {string} lRoleId ��ɫid
	 * @param {function} callback �ص�����
	 * @return {null}  ��
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
	 * ������ѯ
	 * @param {function} callback �ص�����
	 * @return {null}  ��
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
	 * ��������ʷ
	 * @param {number} id ���ߵ�iSeqId
	 * @param {string} name ���ߵ�����
	 * @param {string} pic ���ߵ�ͼƬ��ַ
	 * @param {number} qb ���ߵļ۸�qbΪ��λ
	 * @return {null}  ��
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
	 * ��������ʷ
	 * @return {null}  ��
	 */
	clearLAG:function(){
		$.cookie(MT.global.flag+"_lag",'',{"expires":-1,"path":"/"+globalvar.flag+"/"});
	},
	/**
	 * ��ȡ������ߵ������б�
	 * @return {object}  ������ߵ���Ϣ�б�
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
	 * ��ȡ�û��ĵ�¼��Ϣ
	 * @param {function} callback �ص�����
	 * @return {null}  ��
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
	 * ��ȡ��ǰ�û����Ż�ȯ�б�
	 * @param {function} succ �ɹ���Ļص�����
	 * @param {function} failed ʧ�ܺ�Ļص�����
	 * @return {null}  ��
	 */
	getYhqList:function(succ,failed){
		//��ʾδʹ���Ż�ȯ
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
	 * ת��������Ϣ
	 * @param {object} dataList ��Ҫת���ĵ��������б�
	 * @return {object} ����ת����ĵ�����Ϣ
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
            tmp["payPriceQB"] = MT.Unit.transQbPrice(v["iPayPrice"]);//�����߼۸�*������
			tmp["isBackGWQ"] = v['iTicketBack']?"��":"��";
			
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
			//������Ʒ����
			if( typeof (goodTypes) != "undefined") {
				if( typeof (goodTypes[v["iType"]]) != "undefined")
					tmp["sType"] = goodTypes[v["iType"]]['sTypeName'];
			}
			
			if(v["sTime"])tmp["timeLimitDesc"] = MT.Unit.transTimeLimit(v["sTime"].split("|")[0]);
			if(v["sGoodsName"])tmp["sGoodsName"] = unescape(v["sGoodsName"]).split("|")[0].toHtml();
			if(v["sGoodsPic"]) tmp["sGoodsPic"] = unescape(v["sGoodsPic"]).split("|")[0];
			if(globalvar.flag == 'speed' || globalvar.flag == 'r2' || globalvar.flag == 'x5'){
				if(v["sActionName"] == 'VIP�Ż�') tmp["sActionName"] = '�����Ż�';
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
	 * ��������Ҫ�������ֶλ��㷽������<br/>
	 * </p>
	 */
	Unit:{
		/**
		 * ����ת����������idת�����ַ�����
		 * @param {number} showType ����id
		 * @return {object} ����ת��������
		 */
		transTimeLimit : function(showType) {
			if( typeof showType != "number")
				showType = parseInt(showType);
			if(typeof(dateTypes[showType])=="undefined"){
				return "������";
			}else{
				return dateTypes[showType]['sTimeDesc'];
			}
		},
		/**
		 * ��Q��ת����QB�۸�
		 * @param {number} price Q��
		 * @return {object} ����ת����ļ۸�
		 */
		transQbPrice : function(price) {
			var s_num = (price / 100).toFixed(10) + "";
			return s_num.substring(0,s_num.indexOf(".")<0?s_num.length:(s_num.indexOf(".")+3)); 
		},
		/**
		 * ��Q��ת����QP�۸�
		 * @param {number} price Q��
		 * @return {object} ����ת����ļ۸�
		 */
		transQpPrice : function(price) {
			var s_num = (price / 10).toFixed(10) + "";
			return s_num.substring(0,s_num.indexOf(".")<0?s_num.length:(s_num.indexOf(".")+3)); 
		},
		/**
		 *  ����ȯ�۸�ת��
		 * @param {number} price Q��
		 * @return {object} ����ת����ļ۸�
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
		 *  �����۸�ת��
		 * @param {number} price Q��
		 * @return {object} ����ת����ļ۸�
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
		 *  ����Ҽ۸�ת��
		 * @param {number} price Q��
		 * @return {object} ����ת�����rmb�۸�
		 */
		transRmbPrice : function(price) {
			var s_num = (price / 100).toFixed(10) + "";
			return s_num.substring(0,s_num.indexOf(".")<0?s_num.length:(s_num.indexOf(".")+3)); 
		},
		/**
		 *  ��ȯ�۸�ת��
		 * @param {number} price Q��
		 * @return {object} ����ת�����dq�۸�
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
		 *  ��ʱ�ۿ۴���
		 * @param {number} price Q��
		 * @return {object} ����ת�����qb�۸�
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