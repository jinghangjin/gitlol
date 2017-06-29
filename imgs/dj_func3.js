/**
 * @author haryli
 * @version 2.0
 * @date 2012-12-15
 * @class Mutual.cart
 * <p>
 * ��js���̳ǵ�ǰ��ҳ�潻�������⣬����dj_ca.js��dj_co.js��<br/>
 * ���������з������󶨵�window�����У���ֱ�ӶԷ��������е��á�<br/>
 * </p>
 * <p>
 * ������Ҫ�ǹ��ﳵҳ���ڵ���ز�������
 * </p>
 * SVN: $Id: dj_func.js 36815 2014-07-01 03:48:47Z haryli $
 */

/**
 * ѡ��֧����ʽ����
 * @param {string} payType ֧������
 * @return {null} ����
 *
 */

//"qbqp","tenpayquick","ticketandqbqp","bank","tenpaybank","tenpay","dqandqbqp"
var setPayInfoAct = function(payType,option){
	var help_info = "";
	switch(payType){
		case "qpqb":
			help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'<div class="help_qbqp">\
				<span><a target="_blank" href="http://my.pay.qq.com/account/account_general_query.shtml?ADTAG=PAY.GENERALQUERY.FROM.INDEX" class="font_blue">��ѯ���</a></span>\
				<label>����ʹ��Q��֧������Q�㲻���Զ�ʹ��Q�����������</label>\
			</div>';
			break;
		case "tenpayquick":
			help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'';
			break;
		case "fastbank":
			help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'';
			break;
		case "ticketandqpqb":
			help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'<div class="help_ticket">\
				<span>ʣ�๺���:<span class="font_red" name="left_ticket_num">'+MT[globalvar.flag+"_gwqno"]+'</span></span>\
				<label>����ʹ�ù����֧�����������Զ�ʹ��Q��Q�����������</label>\
			</div>';
			break;
		case "tenpaybank":
			help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'';
			break;
		case "bank":
			help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'';
			break;
		case "tenpay":
			help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'<div class="help_tenpaybank">\
				<span><a target="_blank" href="https://www.tenpay.com/v2/account/purse/mypurse.shtml" class="font_blue">��ѯ�Ƹ�ͨ΢֧�����</a></span>\
			</div>';
			break;
		case "dqandqpqb":
			//�첽����
			//getDqRequest(function(){
			if(typeof(MT[MT.global.flag + "_dqno"])=="undefined"){
				//�����µ�ҳ��
				if(typeof(JSON_order_detail)!=="undefined")
					MT.getDQNum(JSON_order_detail.iZoneId,0,function(){
						help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'<div class="help_ticket">\
							<span>ʣ���ȯ:<span class="font_red" name="left_dq_num">'+(typeof(MT[MT.global.flag + "_dqno"])=="undefined"?"��ѡ������":MT[MT.global.flag + "_dqno"])+'</span></span>\
							<label><a class="font_red" target="_blank" href="http://pay.qq.com/paygame/'+globalvar.flag+'/index.shtml">��ȯ��ֵ</a>������ʹ�õ�ȯ֧�����������Զ�ʹ��Q��Q����������ã�</label>\
						</div>';
						$("#help_area").html(help_info);
					});
			}else{
				//����cartҳ��
				help_info = typeof(option.help_info)!="undefined"&&option.help_info!=""?option.help_info:'<div class="help_ticket">\
						<span>ʣ���ȯ:<span class="font_red" name="left_dq_num">'+(typeof(MT[MT.global.flag + "_dqno"])=="undefined"?"��ѡ������":MT[MT.global.flag + "_dqno"])+'</span></span>\
						<label><a class="font_red" target="_blank" href="http://pay.qq.com/paygame/'+globalvar.flag+'/index.shtml">��ȯ��ֵ</a>������ʹ�õ�ȯ֧�����������Զ�ʹ��Q��Q����������ã�</label>\
					</div>';
				$("#help_area").html(help_info);
			}
			//});
			break;
	}

	$("#help_area").html(help_info);
	$("#pay_list label").removeClass("active");
	if(option.isinmore){
		option.discount==""?"":'<i class="icon_bookmark icon_'+option.discount+'"></i>';
		$("#more_text").html(option.title);
		$("#other_type").addClass("active");
		option.discount==""?"":'<i class="icon_bookmark icon_'+option.discount+'"></i>'
		$("#other_type").find(".icon_bookmark").remove();
		option.discount!=""&&$("#other_type").find("a.radio_box").append('<i class="icon_bookmark icon_'+option.discount+'"></i>');
	}
	$("#"+payType).addClass("active");
	MT.cur_paytype = payType;
	if(MT[MT.global.flag+"_Cart"]&&MT[MT.global.flag+"_Cart"]['deno_price']>0){
		resetPriceNum(MT.getTotalPrice(payType)-MT[MT.global.flag+"_Cart"]['deno_price'],MT.cur_paytype);
	}else{
		resetPriceNum(MT.getTotalPrice(payType),MT.cur_paytype);
	}

};
//��ȡ��ǰ֧�ֵ�֧����ʽ�����ص�ǰҵ���֧����ʽ����
var getCurPayType = function(){
	var cur_option = {};
	if(typeof(globalvar.pay_type)!="undefined"){
		$.each(globalvar.pay_type,function(k,v){
			if(typeof(pay_option[k])!="undefined")
				cur_option[k] = $.extend({},pay_option[k],v);
		});
		if(typeof(MT)!="undefined")MT.payOption = cur_option;
	}else{
		cur_option = {};
	}
	return cur_option;
};
//֧����ʽ��䣬��֧��ģ���¼�
var makePayTypeHtml = function(option){
	if(!option){
		window.console&&console.log("makePayTypeHtml's option is null");
		return;
	}
	var isHasMore = false;
	$("#pay_list").empty();
	var $more_html = $('<div class="btn_group">\
		<label value="more"  id="other_type"><a href="javascript:void(0);" class="radio_box"><span id="more_text">����</span><i class="icon_caret"></i><i class="icon_check"></i></a></label>\
		<div class="dropdown" id="more_group">\
			<ul class="c more_pay">\
			</ul>\
		</div>\
	</div>');
	$.each(option,function(k,v){
		if(!v.isinmore){
			var pay_type_btn = $('<label  id="'+k+'" name="iPayType" class="select '+(!v.isdefault?"":"active")+'" value="'+k+'"><a href="javascript:void(0);" class="radio_box">'+v.title+'<i class="icon_check"></i>'+(v.discount==""?"":'<i class="icon_bookmark icon_'+v.discount+'"></i>')+'</a></label>');
			pay_type_btn.bind("click",function(){v.click.call(v)}||$.noop);
			pay_type_btn.bind("focus",function(){v.click.call(v)}||$.noop);
			$("#pay_list").append(pay_type_btn);
		}else{
			var pay_type_btn = $('<li><label id="'+k+'" name="iPayType" value="'+k+'"><a class="radio" href="javascript:void(0);"><i class="icon_radio"></i>'+v.title+(v.discount==""?"":'<i class="icon_bookmark icon_'+v.discount+'"></i>')+'</a></label></li>');
			pay_type_btn.bind("click",function(){v.click.call(v)}||$.noop);
			pay_type_btn.bind("focus",function(){v.click.call(v)}||$.noop);
			$more_html.find(".more_pay").append(pay_type_btn);
			isHasMore = true;
		}
	});
	$more_html.hover(function(){
		$(this).removeClass("open").addClass("open");
	},function(){
		$(this).removeClass("open");
	});
	isHasMore&&$("#pay_list").append($more_html);
}
//��ʼ��ҳ��
var initPayType = function(){
	window.pay_option = {
		qpqb:{
			discount:"",
			safetyid:globalvar.SafetyID,
			isdefault:true,
			isinmore:false,
			chanel:"qpqb",
			focus:function(){},
			click:function(){
				setPayInfoAct("qpqb",this);
			}
		},
		tenpayquick:{
			discount:"91",
			safetyid:"",
			isinmore:false,
			chanel:"tenpayquick",
			isdefault:false,
			focus:function(){},
			click:function(option){
				setPayInfoAct("tenpayquick",this);
			}
		},
		fastbank:{
			discount:"91",
			safetyid:"",
			isinmore:false,
			chanel:"tenpayquick",
			isdefault:false,
			focus:function(){},
			click:function(option){
				setPayInfoAct("fastbank",this);
			}
		},
		bank:{
			discount:"91",
			isinmore:true,
			safetyid:"",
			isdefault:false,
			chanel:"bank",
			focus:function(){},
			click:function(option){
				setPayInfoAct("bank",this);
			}
		},
		tenpaybank:{
			discount:"91",
			isinmore:true,
			safetyid:"",
			chanel:"tenpaybank",
			isdefault:false,
			focus:function(){},
			click:function(option){
				setPayInfoAct("tenpaybank",this);
			}
		},
		tenpay:{
			discount:"91",
			isinmore:true,
			safetyid:"",
			isdefault:false,
			chanel:"tenpay",
			focus:function(){},
			click:function(option){
				setPayInfoAct("tenpay",this);
			}
		},
		ticketandqpqb:{
			discount:"",
			safetyid:"",
			isinmore:false,
			isdefault:false,
			chanel:"ticketandqpqb",
			focus:function(){},
			click:function(option){
				setPayInfoAct("ticketandqpqb",this);
			}
		},
		dqandqpqb:{
			discount:"",
			isinmore:true,
			safetyid:"",
			chanel:"dqandqpqb",
			isdefault:false,
			focus:function(){},
			click:function(opton){
				setPayInfoAct("dqandqpqb",this);
			}
		}
	};
	//��ȡ��ǰ֧�ֵ�֧����ʽ�����ص�ǰҵ���֧����ʽ����
	var cur_pay_type = getCurPayType();
	//ȥ��loading,֮������ģ����䵽ҳ��
	$("#pay_type .loading").hide("fast",function(){
		makePayTypeHtml(cur_pay_type);
		//����Ĭ��ѡ��֧����ʽ��triggerclick
		$("#pay_list").find(".active").trigger("click");
	});
}
/*
 * ǿ���¶���
 */
forceBuy = function(){
	$(".boxy-wrapper .close").trigger("click");
	$("#step_2 > a").attr("href","javascript:;").attr('class', 'btn_handling ht');
	cancelOrder(i_buy.list, function(){
		AddOrder(1,'');
	}, function(){
		var msg = "<div class='submit_con'><h2>�µ�ʧ��</h2>�Բ���ϵͳ��æ����ˢ��ҳ������ԣ�"+
				"<br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
		window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});
	});
}
/**
 * ���֧������
 * @param {bool} validate �Ƿ���Ҫ��֤
 * @return {null} ����
 */
dnfConfirmPopup = function(){
	$('#dnf_confirm').show();
	var left = ($(window).width()-$('#dnf_confirm').outerWidth(true))/2 + $(window).scrollLeft();
	var top = ($(window).height()-$('#dnf_confirm').outerHeight(true))/2 + $(window).scrollTop();
	$('#dnf_confirm').offset({top:top, left:left});

	MT.getDQNum($('#iZone').val(),0,function(){
		$('#pay_type .loading').hide();
		//alert(MT.getTotalUnDisPrice() + '--' + MT['cart_discount']['dq']);
		
		if(MT[MT.global.flag + "_dqno"] - MT.getTotalUnDisPrice() >= 0){
			var areaHtml = ['<div class="help_ticket">',
				'<span>ʣ���ȯ:<span class="font_red" name="left_dq_num">'+(typeof(MT[MT.global.flag + "_dqno"])=="undefined"?"��ѡ������":MT[MT.global.flag + "_dqno"])+'</span>(1��ȯ=0.01Q��)</span>',
				'<label><a class="font_blue" target="_blank" href="http://pay.qq.com/paygame/'+globalvar.flag+'/index.shtml">��ȯ��ֵ</a></label>',
				'</div>'].join('');
			$('#dnf_confirm .dnf_order_submit').show();
			$('#dnf_confirm .dnf_order_pay').hide();
			$('#dnf_unpay_group').hide();
			$('#dnf_pay_group').show();
		}else{
			var areaHtml = ['<div class="help_ticket">',
				'<span>ʣ���ȯ:<span class="font_red" name="left_dq_num">'+(typeof(MT[MT.global.flag + "_dqno"])=="undefined"?"��ѡ������":MT[MT.global.flag + "_dqno"])+'</span></span>',
				'<label><b class="font_red">����</b></label>',
				'</div>'].join('');
			$('#dnf_confirm .dnf_order_submit').hide();
			$('#dnf_confirm .dnf_order_pay').show();
			$('#dnf_pay_group').hide();
			$('#dnf_unpay_group').show();
		}
		$('#help_area').html(areaHtml);
		UserDq();
	});
};
$('#dnf_confirm_submit').click(function(){
	$('#dnf_confirm').data('dnf_confirm', 1);
	$('#dnf_confirm').hide();
	AddOrder();
});
$('#dnf_confirm_recharge').click(function(){
	$('#dnf_confirm').hide();
	$('#dnf_confirm').data('dnf_confirm', 0);
	rechargeBuy();
});
$('#dnf_confirm .cancel').click(function(){
	$('#dnf_confirm').hide();
	$('#dnf_confirm').data('dnf_confirm', 0);
});

rechargePopup = function(){
	$('#dnf_recharge_confirm').show();
	var left = ($(window).width()-$('#dnf_recharge_confirm').outerWidth(true))/2 + $(window).scrollLeft();
	var top = ($(window).height()-$('#dnf_recharge_confirm').outerHeight(true))/2 + $(window).scrollTop();
	$('#dnf_recharge_confirm').offset({top:top, left:left});
	
	$('#dnf_recharge_confirm .loading').hide();
	if(MT[MT.global.flag + "_dqno"] - MT.getTotalUnDisPrice() >= 0){
		$('#dnf_recharge_confirm .pay_group .option').eq(0).show().siblings('.option').hide();
		$('#dnf_recharge_confirm .dnf_order_submit').eq(0).show().siblings('.dnf_order_submit').hide();
	}else{
		$('#dnf_recharge_confirm .pay_group .option').eq(1).show().siblings('.option').hide();
		$('#dnf_recharge_confirm .dnf_order_submit').eq(1).show().siblings('.dnf_order_submit').hide();
	}
	UserDq();
};
$('#dnf_recharge_confirm_submit').click(function(){
	$('#dnf_confirm').data('dnf_confirm', 1);
	$('#dnf_recharge_confirm').hide();
	AddOrder();
});
$('#dnf_recharge_confirm_return').click(function(){
	$('#dnf_recharge_confirm').hide();
	$('#dnf_confirm').data('dnf_confirm', 0);
	rechargeSuccessPopup();
});
$('#dnf_recharge_confirm .cancel').click(function(){
	$('#dnf_recharge_confirm').hide();
	$('#dnf_confirm').data('dnf_confirm', 0);
});

rechargeSuccessPopup = function(){
	MT.getDQNum($('#iZone').val(),0,function(){
		if(MT[MT.global.flag + "_dqno"] - MT.getTotalUnDisPrice() >= 0){
			$('#dnf_recharge_success').hide();
			rechargePopup();
		}else{
			$('#dnf_recharge_success').show();
			var left = ($(window).width()-$('#dnf_recharge_success').outerWidth(true))/2 + $(window).scrollLeft();
			var top = ($(window).height()-$('#dnf_recharge_success').outerHeight(true))/2 + $(window).scrollTop();
			$('#dnf_recharge_success').offset({top:top, left:left});
			window.rechargeSuccessPopupTimes || (window.rechargeSuccessPopupTimes = 0);
			if(window.rechargeSuccessPopupTimes >= 3){
				$('#dnf_recharge_success').hide();
				rechargePopup();
			}else{
				window.rechargeSuccessPopupSid = window.setTimeout(function(){
					rechargeSuccessPopup();
					window.rechargeSuccessPopupTimes ++;
				}, 1000);
			}
		}
	});
};
$('#dnf_recharge_success .cancel').click(function(){
	window.clearTimeout(window.rechargeSuccessPopupSid);
	$('#dnf_recharge_success').hide();
	$('#dnf_confirm').data('dnf_confirm', 0);
});

AddOrder = function(forceBuy,serials,validate){
	if(!LoginManager.isLogin()) {
		LoginManager.login();
		return;
	}
	var  is_pass = true;
	if($.isFunction(validate)){
		is_pass = validate();
	}
	if(is_pass){
		AddOrder_(forceBuy,serials);
	}
};

AddOrder_ = function(forceBuy,serials){
	var forceBuy = forceBuy||0;

	if(JSON_cart.iTotalNum==0){
		new Boxy('<span>���Ĺ��ﳵ��û�е��ߣ��Ͽ�ȥ��ѡ������ <a class="font_blue" href="/'+globalvar.flag+'/list/shoppinglist.shtml">��Ҫ��</a></span>',{title:"��ܰ��ʾ",closeText:"",modal:true});
		return;
	}

	//����ѡ���ж�
	if(globalvar.areaLevel == 2) {
		if($("#area").val() == "") {
			$("#error_info").html($("#area option:selected").html());
			return;
		}
	}
	if(globalvar.areaLevel>0)
	{
		if(typeof(globalvar.iGameType)=="undefined"||globalvar.iGameType==0)
		{
			globalvar.iGameType = 0;
			if($("#iZone").val() == "") {
				$("#error_info").html($("#iZone option:selected").html());
				return;
			}
		}
		else if(globalvar.iGameType!=0&&globalvar.iGameType!=3)
		{
			if($("#iZone").val() == "") {
				$("#error_info").html($("#iZone option:selected").html());
				return;
			}
			if($("#iRoleId").val() == ""||$("#iRoleId ").val()==null) {
				$("#error_info").html($("#iRoleId option:selected").html());
				return;
			}
		}
	}
	//���ﳵ����id
	var goodsid = [];
	if(JSON_cart && JSON_cart.list){
		$.each(JSON_cart.list, function(){
			goodsid.push(this.iSeqId);
		});
	}
	if(goodsid.length == 0){
		$("#error_info").html('���ﳵ��û����Ʒ');
		return ;
	}
	goodsid = goodsid.join(',');

	var param_a = {
		'_app_id':1003,
		'_plug_id':7000,
		"_biz_code": globalvar.flag,
		'_ver': 'v2',
		"areaid":$("#iZone").val(),
		'goodsid':goodsid,
		"needVip":MT[MT.global.flag + "_Cart"]["needVip"],
		"r":Math.random()
	};


	if(MT['cart_discount']['coupon_id'] > 0){
		param_a.coupon = MT['cart_discount']['coupon_id'];
		//buy_url+="&coupon="+MT['cart_discount']['coupon_id'];
	}
	if(MT['cart_discount']['ticket'] > 0){
		param_a.ticket = Math.round(globalvar.flag == 'r2' ? MT['cart_discount']['ticket']*100 : MT['cart_discount']['ticket']);
		//buy_url+="&ticket="+ticket;
	}
	var roleid = $.trim($("#iRoleId").val());
	if(roleid){
		//var rolename = $("#iRoleId").find('option[value="'+$("#iRoleId").val()+'"]').html();
		var rolename = window.roleInfo[roleid];
		param_a.roleid=roleid;
		param_a.rolename=rolename;
		//buy_url+="&roleid="+roleid+'&rolename='+rolename;
	}
	if(globalvar.flag == 'dnf'){// ֻ��dnfʹ�õ�ȯ
		//console.log(MT.getTotalUnDisPrice(), MT['cart_discount']['dq'], MT.getTotalUnDisPrice() - MT['cart_discount']['dq']);
		if($('#dnf_confirm').data('dnf_confirm')){
			if(MT.getTotalUnDisPrice() - MT['cart_discount']['dq'] > 0){
				var msg = "<div class='submit_con'><h2>��ȯ����</h2>���ֵ�����ԣ�<a href='http://pay.qq.com/paygame/dnf/index.shtml' target='_blank' class='font_red'>��ȯ��ֵ</a>"+
						"<br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
				window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});
				return;
			}else{
				param_a.dq = MT['cart_discount']['dq'];
				//buy_url+="&dq="+MT['cart_discount']['dq'];
			}
		}else{
			dnfConfirmPopup();
			return ;
		}
	}

	$("#step_2 > a").attr("href","javascript:;").attr('class', 'btn_handling ht');
	if(globalvar.flag == 'dnf'){
		ticketBuy(param_a);
	}else{
		mallBuy(param_a);
	}
};
mallBuy = function(params){
	var buy_url = "http://apps.game.qq.com/cgi-bin/daoju/v3/hs/i_buy.cgi?"+$.param(params);
	$.getScript(buy_url,function(){
		var json = i_buy;
		var msg = "";
		switch(json.ret){
			case "0":
				if(globalvar.flag == 'dnf'){
					window.location = 'http://daoju.qq.com/'+MT.global.flag+'/success2.shtml?serial='+json.serial;
				}else{
					cloudPay2(json.serial);
				}
				break;
			case '-7014':
				//����ȡ������
				var _serials = [];
				json["flag"] = MT.global.flag;
				msg = $("#order_repeat").tmpl(json);
				break;
			default:
				msg = "<div class='submit_con'><h2>��������ʧ��</h2><br/>"+json.msg+"<br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
				break;
		}
		if(json.ret!="0"){
			$("#step_2 > a").attr("href","javascript:AddOrder();").attr('class', 'btn_confirm ht');
			window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});
		}
	});
};
rechargeBuy = function(){
	var buynum = Math.ceil((CartPrice.total - CartPrice.dq)/100)*100;
	var params = {
		'_app_id':1003,
		'_plug_id':7001,
		"_biz_code": globalvar.flag,
		'_ver': '1',
		'_ts': parseInt((new Date).getTime()/1000),
		"buynum":buynum,
		'areaid':$.trim($("#iZone").val()),
		"roleid":$.trim($("#iRoleId").val())
	};
	
	var buy_url = "http://apps.game.qq.com/cgi-bin/daoju/v3/hs/i_buy.cgi?"+$.param(params);
	$.getScript(buy_url,function(){
		var json = i_buy;
		if(json.result == 0 && json.data && json.data.serial){
			cloudPay2(json.data.serial, true);
		}else{
			var msg = "<div class='submit_con'><h2>��������ʧ��</h2><br/>"+json.msg+"<br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
			window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});
		}
	});
};

ticketBuy = function(params){
	var buygoods_url = "http://apps.game.qq.com/comm-cgi-bin/iframe_encry_tool/safety_check.cgi";
		//var buygoods_url = 'http://daoju.qq.com/mall/satety.shtml';
	params.SatetyID = 'DAOJU_COMMONDQ';

	var iframe = document.getElementById('satetyIframe');
	if(!iframe){
		iframe = document.createElement('iframe');
		iframe.id = 'satetyIframe';
		iframe.width = 400;
		iframe.height = 292;
		iframe.style.position = 'absolute';
		iframe.style.border = '0';
		document.body.appendChild(iframe);

		var messenger = new Messenger('djc_buy2_parent', 'djc_buy2_shtml');
		var sid = 0;
		messenger.listen(function(satetySearch){
			if(satetySearch.indexOf('?') === 0){
				param_a = {};
				$.each(satetySearch.substr(1).split('&'), function(){
					var seg = this.split('=');
					param_a[seg[0]] = seg[1];
				});
				$('#satetyIframe').hide();
				mallBuy(param_a);
			}
		});
	}
	iframe.style.left = ($(window).width()-iframe.width)/2 + $(window).scrollLeft() + 'px';
	iframe.style.top = ($(window).height()-iframe.height)/2 + $(window).scrollTop() + 'px';
	iframe.src = buygoods_url + '?' + $.param(params);
	$('#satetyIframe').show();
};
/**
 * ��֧��
 */
cloudPay = function(eventid, serial, amount){
	var url = "http://apps.game.qq.com/daoju/v3/api/hx/pay/cpay/mall/pay.php?eventid="+eventid+"&biz="+MT.global.flag+"&channel=mall&serial="+serial+"&amount="+amount+"&time=" + Math.random();

	$.getScript(url, function(){
		if ('undefined' == typeof (opay) || null == opay) {//�����쳣
			var msg = "<div class='submit_con'><h2>֧��ʧ��</h2><br/>�ܱ�Ǹ��Ŀǰ�û�Ĳ����������࣬������<a class='font_blue' href='http://daoju.qq.com/mall/trade_detail2.shtml?flag="+globalvar.flag+"&serial="+serial+"&continue_pay=1&ADTAG=cop.innercop.DJ.CART.CONTINUE.PAY'>��˼���֧��</a><br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
			window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});

			$("#step_2 > a").attr("href","javascript:AddOrder();").attr('class', 'btn_confirm ht');
		}else{
			if(opay.ret == 0){
				if(!opay.data || !opay.data.url){
					window.location = 'http://daoju.qq.com/'+MT.global.flag+'/success2.shtml?serial='+serial;
				}
				$("#step_2 > a").attr("href","javascript:;").attr('class', 'btn_paying ht');
				var sUrl = opay.data.url;
				sUrl = sUrl.replace(/&amp;/g, '&');
				fusion2.dialog.buy({
					// ��ѡ���������롰���߼��ۡ�ģʽ��Ӧ��ʹ����Ϸ�ҿ��֧������ʱ�����봫�ò�����ȡֵ�̶�Ϊ��true����
					// ����֧����������Ҫ����ò�����
					disturb: true,
					// ���롣 ��ʾ������Ʒ��url������url_params�ǵ���Q��ֱ���ӿ�v3/pay/buy_goods����߼��۽ӿ�v3/pay/exchange_goods�ӿڷ��صĲ�����
					param: sUrl,
					// ��ѡ����ʾ�Ƿ�ʹ��ɳ����Ի�����Ӧ�÷���ǰ�������ע�͵�����
					// sandboxֵΪ�����͡�true��ʹ�ã� false��ָ������ʹ�á�
					sandbox: opay.sandbox == 'true' ? true : false,
					//��ѡ��ǰ̨ʹ�õ������ı��������ڻص�ʱʶ����Դ��
					context: "context",
					//��ѡ���û�����ɹ�ʱ�Ļص�����������opt.contextΪ����context����������û�����ɹ����������ص�JS�е�onSuccess�����û��رնԻ���ʱ�ٻص�onClose��
					onSuccess: function (opt) {
						$.getScript('http://apps.game.qq.com/daoju/v3/report/pay?iType=1&iAppId=1003&sBizCode='+MT.global.flag+'&sSerialNum='+serial);
					},
					//��ѡ���û�ȡ������ʱ�Ļص�����������opt.contextΪ����context����������û�����ʧ�ܻ�û�й��򣬹رնԻ���ʱ���Ȼص�onCancel�ٻص�onClose��
					onCancel: function (opt) {},
					//��ѡ�������ʵ��Q��ֱ������ʱ�����˷���֪ͨ�ӿڣ�����Ҫʵ�ֱ�����������opt.contextΪ����context���������������ʱ���������ص�onSend��
					onSend: function (opt) {},
					//��ѡ���Ի���ر�ʱ�Ļص���������Ҫ���ڶԻ���رպ����UI����ĵ�����onSuccess��onCancel������Ӧ���߼��Ĵ������������ϡ�
					onClose: function (opt) {
						window.location = 'http://daoju.qq.com/'+MT.global.flag+'/success2.shtml?serial='+serial;
					}
				});
			}else if(opay.ret == 1002){
				//alert('�Բ������¼������');
				LoginManager.login();
			}else{
				var msg = "<div class='submit_con'><h2>֧��ʧ��</h2><br/>�Բ���ϵͳ��æ��������<a class='font_blue' href='http://daoju.qq.com/mall/trade_detail2.shtml?flag="+globalvar.flag+"&serial="+serial+"&continue_pay=1&ADTAG=cop.innercop.DJ.CART.CONTINUE.PAY'>��˼���֧��</a><br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
				window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});
				$("#step_2 > a").attr("href","javascript:AddOrder();").attr('class', 'btn_confirm ht');
			}
		}
	});
};
cloudPay2=function(serial, isRechargeBuy){
	var url = "http://apps.game.qq.com/cgi-bin/daoju/v3/pay/i_pay.cgi?_retKey=ret&_app_id=1003&paytype=1&apptype=0&_appname="+MT.global.flag+"&serial="+serial+"&_output_fmt=2&time="+Math.random();

	$.getScript(url, function(){
		if ('undefined' == typeof (i_pay) || null == i_pay) {//�����쳣
			var msg = "<div class='submit_con'><h2>֧��ʧ��</h2><br/>�ܱ�Ǹ��Ŀǰ�û�Ĳ����������࣬������<a class='font_blue' href='http://daoju.qq.com/mall/trade_detail2.shtml?flag="+globalvar.flag+"&serial="+serial+"&continue_pay=1&ADTAG=cop.innercop.DJ.CART.CONTINUE.PAY'>��˼���֧��</a><br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
			window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});

			$("#step_2 > a").attr("href","javascript:AddOrder();").attr('class', 'btn_confirm ht');
		}else{
			if(i_pay.ret == 0){
				if(!i_pay.urlParams){
					window.location = 'http://daoju.qq.com/'+MT.global.flag+'/success2.shtml?serial='+serial;
					return;
				}
				$("#step_2 > a").attr("href","javascript:;").attr('class', 'btn_paying ht');
				var sUrl = i_pay.urlParams;
				sUrl = sUrl.replace(/&amp;/g, '&');
				fusion2.dialog.buy({
					// ��ѡ���������롰���߼��ۡ�ģʽ��Ӧ��ʹ����Ϸ�ҿ��֧������ʱ�����봫�ò�����ȡֵ�̶�Ϊ��true����
					// ����֧����������Ҫ����ò�����
					disturb: true,
					// ���롣 ��ʾ������Ʒ��url������url_params�ǵ���Q��ֱ���ӿ�v3/pay/buy_goods����߼��۽ӿ�v3/pay/exchange_goods�ӿڷ��صĲ�����
					param: sUrl,
					// ��ѡ����ʾ�Ƿ�ʹ��ɳ����Ի�����Ӧ�÷���ǰ�������ע�͵�����
					// sandboxֵΪ�����͡�true��ʹ�ã� false��ָ������ʹ�á�
					sandbox: i_pay.sandbox == '1' ? true : false,
					//��ѡ��ǰ̨ʹ�õ������ı��������ڻص�ʱʶ����Դ��
					context: "context",
					//��ѡ���û�����ɹ�ʱ�Ļص�����������opt.contextΪ����context����������û�����ɹ����������ص�JS�е�onSuccess�����û��رնԻ���ʱ�ٻص�onClose��
					onSuccess: function (opt) {
						$.getScript('http://apps.game.qq.com/daoju/v3/report/pay?iType=1&iAppId=1003&sBizCode='+MT.global.flag+'&sSerialNum='+serial);
						
						if(isRechargeBuy){
							$('.fusion_dialog_header button').trigger('click');
							rechargeSuccessPopup();
						}
					},
					//��ѡ���û�ȡ������ʱ�Ļص�����������opt.contextΪ����context����������û�����ʧ�ܻ�û�й��򣬹رնԻ���ʱ���Ȼص�onCancel�ٻص�onClose��
					onCancel: function (opt) {},
					//��ѡ�������ʵ��Q��ֱ������ʱ�����˷���֪ͨ�ӿڣ�����Ҫʵ�ֱ�����������opt.contextΪ����context���������������ʱ���������ص�onSend��
					onSend: function (opt) {},
					//��ѡ���Ի���ر�ʱ�Ļص���������Ҫ���ڶԻ���رպ����UI����ĵ�����onSuccess��onCancel������Ӧ���߼��Ĵ������������ϡ�
					onClose: function (opt) {
						if(isRechargeBuy){
							$("#step_2 > a").attr("href","javascript:AddOrder();").attr('class', 'btn_confirm ht');
						}else{
							window.location = 'http://daoju.qq.com/'+MT.global.flag+'/success2.shtml?serial='+serial;
						}
					}
				});
			}else if(i_pay.ret == -6530){
				//alert('�Բ������¼������');
				LoginManager.login();
			}else{
				var msg = "<div class='submit_con'><h2>֧��ʧ��</h2><br/>�Բ���ϵͳ��æ��������<a class='font_blue' href='http://daoju.qq.com/mall/trade_detail2.shtml?flag="+globalvar.flag+"&serial="+serial+"&continue_pay=1&ADTAG=cop.innercop.DJ.CART.CONTINUE.PAY'>��˼���֧��</a><br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>";
				window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});
				$("#step_2 > a").attr("href","javascript:AddOrder();").attr('class', 'btn_confirm ht');
			}
		}
	});
};
/**
 * ȡ������
 * arr Array [{eventid, serial}, ...]
 * success Function��������ִ�гɹ�ʱ, �ص�
 * error Function�κ�һ������ʧ�ܣ��ص�ִ��һ��
 */
cancelOrder=function(arr, success, error){
	var i = 0, stat = true;
	$.each(arr, function(){
		var url = "http://apps.game.qq.com/daoju/v3/api/hx/order/mall/CancelOrder.php?eventid="+this.sEventId+'&serial='+this.sSerialNum;
		$.getScript(url, function(){
			if(stat === true){
				if(oCancelOrder.ret=="0"){
					i++;
					i == arr.length && success();
				}else{
					stat = false;
					error();
				}
			}
		});
	});
};

/**
 * ���֧������
 * @param {bool} validate �Ƿ���Ҫ��֤
 * @return {null} ����
 */
PayOrder = function(validate){
	if(!LoginManager.isLogin()) {
		LoginManager.login();
		return;
	}
	var  is_pass = true;
	if($.isFunction(validate)){
		is_pass = validate();
	}
	if(is_pass){
		PayOrder_();
	}
}
/**
 * ���֧������������BuyItem
 * @return {null} ����
 */
PayOrder_ = function() {
	if(JSON_order_detail.list.length==0){
		new Boxy('<span>��������Ϊ�գ�������ˢ��ҳ��</span>',{title:"��ܰ��ʾ",closeText:"",modal:true});
		return;
	}

	var totalPriceQB = MT.Unit.transQbPrice(MT.getTotalPrice());//��gwd��dq�ж��ã���������
	var buygood_url = "http://apps.game.qq.com/cgi-bin/daoju/market/buy_goods.cgi";
	var safety_url = "http://apps.game.qq.com/comm-cgi-bin/iframe_encry_tool/safety_check.cgi";
	var payType = $("[name=iPayType].active").attr("value");
	var cur_pay_type = MT.payOption[payType];

	if(payType=="ticketandqpqb"){
		var ticket_no = parseFloat(JSON_show_login.ticket);
		if(ticket_no==0)
		{
			$("#error_info").html( "���Ĺ�������Ϊ0����ѡ������֧����ʽ");
			return;
		}
		cur_pay_type.safetyid = (function(){
			var ticket_no = parseFloat(JSON_show_login.ticket);
			return ticket_no<parseInt(totalPriceQB * 100)?globalvar.TicketSatetyID:"";
		})();
	}else if(payType=="dqandqpqb"){
		if(MT[MT.global.flag + "_dqno"]==0)
		{
			$("#error_info").html( "���ĵ�ȯ���Ϊ0����ѡ������֧����ʽ");
			return;
		}
		cur_pay_type.safetyid = (function(){
			//��ȯ>0���������߸���
			if(parseInt(MT[MT.global.flag + "_dqno"]) < parseInt(totalPriceQB * 100)){
				return globalvar.DqSatetyID;
			}else if(typeof(globalvar.MibaoDQ)!="undefined"&&globalvar.MibaoDQ!=""){
				cur_pay_type.chanel = "dq";//��ȯ�㹻������£�����ĳ�dq
				return globalvar.MibaoDQ;
			}else{
				return "";
			}
		})();
	};

	var param_a = {
		"SatetyID":cur_pay_type.safetyid,
		"serial":JSON_order_detail.sSerialNum,
		"type":"htm",
		"flag": globalvar.flag,
		"iGameType":globalvar.iGameType,
		"area":$("#area").val(),
		"iZone":$("#iZone").val(),
		"iPayType":cur_pay_type.chanel,
		"isLicenceChecked":1,
		"iRoleId":$("#iRoleId").val(),
		"cartPrice":MT.getTotalUnDisPrice(),
		"quick":payType=="tenpayquick"?1:0
	};
	var param_info = "?"+$.param(param_a);
	//�Ƿ����ܱ�
	if(cur_pay_type.safetyid=="")
	{
		//�����ܱ�
		var buy_url = buygood_url+ param_info;
	}
	else
	{
		//���ܱ�
		var buy_url = safety_url + param_info;
	}

	if(JSON_order_detail.sCoupon!="")
	{
		buy_url+="&couponid="+JSON_order_detail.sCoupon;
	}
	$(".btn_pay_submit_2").removeAttr("href").removeClass("btn_pay_submit_2").addClass("btn_pay_submit_3");

	window.buy_url = buy_url;
	showCartBuyBox(buy_url,true);

	delete MT[MT.global.flag+"_gno"];

	return;
}

/**
 * ���֧������
 * @param {bool} validate �Ƿ���Ҫ��֤
 * @return {null} ����
 */
BuyItem = function(validate){
	if(!LoginManager.isLogin()) {
		LoginManager.login();
		return;
	}
	var  is_pass = true;
	if($.isFunction(validate)){
		is_pass = validate();
	}
	if(is_pass){
		BuyItem_();
	}
}
/**
 * ���֧������������BuyItem
 * @return {null} ����
 */
BuyItem_ = function() {
	if(JSON_cart.iTotalNum==0){
		new Boxy('<span>���Ĺ��ﳵ��û�е��ߣ��Ͽ�ȥ��ѡ������ <a class="font_blue" href="/'+globalvar.flag+'/list/shoppinglist.shtml">��Ҫ��</a></span>',{title:"��ܰ��ʾ",closeText:"",modal:true});
		return;
	}

	//����ѡ���ж�
	if(globalvar.areaLevel == 2) {
		if($("#area").val() == "") {
			$("#error_info").html($("#area option:selected").html());
			return;
		}
	}
	if(globalvar.areaLevel>0)
	{
		if(typeof(globalvar.iGameType)=="undefined"||globalvar.iGameType==0)
		{
			globalvar.iGameType = 0;
			if($("#iZone").val() == "") {
				$("#error_info").html($("#iZone option:selected").html());
				return;
			}
		}
		else if(globalvar.iGameType!=0&&globalvar.iGameType!=3)
		{
			if($("#iZone").val() == "") {
				$("#error_info").html($("#iZone option:selected").html());
				return;
			}
			if($("#iRoleId").val() == ""||$("#iRoleId ").val()==null) {
				$("#error_info").html($("#iRoleId option:selected").html());
				return;
			}
		}
	}

	var totalPriceQB = MT.Unit.transQbPrice(MT.getTotalPrice());//��gwd��dq�ж��ã���������
	var buygood_url = "http://apps.game.qq.com/cgi-bin/daoju/market/buy_goods.cgi";
	var safety_url = "http://apps.game.qq.com/comm-cgi-bin/iframe_encry_tool/safety_check.cgi";
	var payType = $("[name=iPayType].active").attr("value");
	var cur_pay_type = MT.payOption[payType];

	if(payType=="ticketandqpqb"){
		var ticket_no = parseFloat(JSON_show_login.ticket);
		if(ticket_no==0)
		{
			$("#error_info").html( "���Ĺ�������Ϊ0����ѡ������֧����ʽ");
			return;
		}
		cur_pay_type.safetyid = (function(){
			//���>0������ֵ������globalvar.TicketSatetyID
			//����㹻����Ϊ��
			var ticket_no = parseFloat(JSON_show_login.ticket);
			return ticket_no<parseInt(totalPriceQB * 100)?globalvar.TicketSatetyID:"";
		})();
	}else if(payType=="dqandqpqb"){
		if(MT[MT.global.flag + "_dqno"]==0)
		{
			$("#error_info").html( "���ĵ�ȯ���Ϊ0����ѡ������֧����ʽ");
			return;
		}
		cur_pay_type.safetyid = (function(){
			//��ȯ>0���������߸���
			if(parseInt(MT[MT.global.flag + "_dqno"]) < parseInt(totalPriceQB * 100)){
				return globalvar.DqSatetyID;
			}else if(typeof(globalvar.MibaoDQ)!="undefined"&&globalvar.MibaoDQ!=""){
				cur_pay_type.chanel = "dq";//��ȯ�㹻������£�����ĳ�dq
				return globalvar.MibaoDQ;
			}else{
				return "";
			}
		})();
	}

	var param_a = {
		"SatetyID":cur_pay_type.safetyid,
		"type":"htm",
		"flag": globalvar.flag,
		"iGameType":globalvar.iGameType,
		"area":$("#area").val(),
		"iZone":$("#iZone").val(),
		"iPayType":cur_pay_type.chanel,
		"isLicenceChecked":1,
		"iRoleId":$("#iRoleId").val(),
		"cartPrice":MT.getTotalUnDisPrice(),
		"quick":payType=="tenpayquick"?1:0,
		"needVip":MT[MT.global.flag + "_Cart"]["needVip"]
	};
	var param_info = "?"+$.param(param_a);
	//�Ƿ����ܱ�
	if(cur_pay_type.safetyid=="")
	{
		//�����ܱ�
		var buy_url = buygood_url+ param_info;
	}
	else
	{
		//���ܱ�
		var buy_url = safety_url + param_info;
	}

	if(typeof(MT[MT.global.flag+"_Cart"]['coupon_id'])!="undefined")
	{
		buy_url+="&couponid="+MT['cart_discount']['coupon_id'];
	}
	$(".btn_pay_submit_2").removeAttr("href").removeClass("btn_pay_submit_2").addClass("btn_pay_submit_3");

	window.buy_url = buy_url;
	showCartBuyBox(buy_url);

	//delete MT[MT.global.flag+"_Cart"]['coupon_id'];
	delete MT[MT.global.flag+"_gno"];

	return;
}
/*
 *	�������򵯲�
 * @return {null} ����
 */
showCartBuyBox = function(buy_url,isNotReload){
	//���͹�������
	window.buy_box = new Boxy("<iframe src="+buy_url+" marginwidth=0 marginheight=0 frameborder=0 width=390px style='border:#ffffff' height=300px></iframe>",{title:"���߹���",closeText:"",modal:true,afterHide:function(){
		typeof(isNotReload)=="undefined"&&location.reload();
		$(".btn_pay_submit_3").replaceWith('<a class="btn_pay_submit_2 ht clear" href="javascript:PayOrder();">ȷ��֧��</a>');
	}});
}
/*
 *	����minipay����
 * @return {null} ����
 */
showRecharge = function(price){
	minipay.dialog.recharge({
		amount:price,
		aid:"daoju.qq.com.mini",
		onSuccess:function(){
			//alert('success');
		},
		onError:function(){
			//alert('error');
		},
		onClose:function(){
			miniPayCloseCallBack(price);
		}
	});
	//���ҳ��ˢ�²���
	window.buy_box.options.afterHide = $.noop;
	window.buy_box.hide();
}
/*
 *	��ֵ�ɹ����repay����
 * @return {null} ����
 */
showReCartBuyBox = function(){
	showCartBuyBox(window.buy_url);
	window.mini_callback.options.afterHide = $.noop;
	window.mini_callback.hide();
}

/*
 *	minipay��ֵ�ɹ���ĵ���
 * @return {null} ����
 */
miniPayCloseCallBack = function(price){
	window.mini_callback = new Boxy('<div><p style="line-height:30px;padding:0;">�������ֵ�ɹ�������<a class="btn_org_s" style="display:inline-block;*display:inline;*zoom:1;" href="javascript:showReCartBuyBox();">ȷ��֧��</a>�����Ʒ����</p><p style="line-height:30px;padding:0;">\
			�������ֵʧ�ܣ�����<a class="btn_blue_s" style="display:inline-block;*display:inline;*zoom:1;" href="http://pay.qq.com/paycenter/index.shtml?aid=daoju.qq.com.pay&n='+price+'" target="_blank">��ֵ</a>������ֵ��</p></div>',
			{title:"��ܰ��ʾ",closeText:"",modal:true,afterHide:function(){
				location.reload();
			}});
}

/**
 * ��ֵ���ﳵҳ�治֧ͬ����ʽ�ļ۸���ʾ
 * @param {number} _qfnum Q�ּ۸�
 * @return {null} ����
 */
resetPriceNum = function(_qfnum,pay_type){
	if(isNaN(_qfnum)) return;
	var qb_val = MT.Unit.transQbPrice(_qfnum);
	var unit = MT.payOption[pay_type]['unit'];
	var desc = MT.payOption[pay_type]['convert']||"";
	$("#js_real_last_QB").html(qb_val);
	$("#pay_unit").html(unit);
	$(".price_desc").html(desc);
};
/**
 * ��������ȡ���߼۸�
 * @param {number} iType �������id
 * @return {number} ���ؼ���õķ���۸�
 */
TotalPriceByType =  function(iType)
{
	var totalP = 0;
	$.each(MT[MT.global.flag+"_Cart"]['list'],function(k,item){
		if(item.iType==iType)
		{
			totalP+=parseInt(item.iPrice)*parseInt(item.iNum);
		}
	})
	return totalP;
}
/**
 * �����Ż�ȯʹ�ð�ť
 * @param {object} obj ����ʵ�����
 * @return {number} ���ؼ���õķ���۸�
 */
UserYhq = function(obj){
	if($(obj).hasClass('cur')==true){
		clearYhqCheck();
		$(obj).removeClass('cur');
		return;
	}
	clearYhqCheck();
	window.useCoupon=$(obj).index();
	//sName="{$sTemptName}" iCouponId="{$iCouponId}" iConsume="{$iConsume}" ="{$iDenominate}"
	var sName = $(obj).attr("sName");
	var iCouponId = $(obj).attr("iCouponId");
	var iConsume = parseInt($(obj).attr("iConsume"));
	var iDenominate = parseInt($(obj).attr("iDenominate")) || 0;
	var sSubRule = $(obj).attr("sSubRule").split(":");
	var type_info = "";
	var total_qb = MT.Unit.transQbPrice(MT.getTotalPrice()),denate_qb = MT.Unit.transQbPrice(iDenominate),tp=0;//tp ��������ܼ�
	var pay_type = $("[name=iPayType].active").val()||"qpqb";
	var type_names = [];
	var sSubRules = typeof(sSubRule[1])!="undefined"?sSubRule[1].split("|"):"";
	MT[MT.global.flag+"_Cart"]['total_price'] = MT.getTotalPrice(pay_type);
	MT[MT.global.flag+"_Cart"]['deno_price'] = iDenominate;//�Ż�ȯ��ֵ

	if(sSubRule.length>1)
	{
		switch(sSubRule[0])
		{
			case "1"://ֻ������
				$.each(sSubRules,function(k,v){
					v = parseInt(v);
					tp+=TotalPriceByType(v);
				});
				$.each(sSubRule[1].split("|"),function(k,v){
					v = parseInt(v);
					goodTypes[v] && type_names.push(goodTypes[v]['sTypeName']);
				});
				type_info = type_names.join(",");
				target_url = "list/shoppinglist.shtml?iType="+sSubRule[1];
				break;
			case "2"://�������С��
				break;
			case "3"://����Ƽ�λ
				break;
			case "4":
				var currDate = JSON_sys_time.sMsg.replace(/:\d{6}/, '');
				MT[MT.global.flag+"_Cart"].list && $.each(MT[MT.global.flag+"_Cart"].list, function(){
					if(currDate < this.dtDiscountBegin || currDate >= this.dtDiscountEnd){
						tp+=parseInt(this.iPrice)*parseInt(this.iNum);
					}
				});
				type_info = "����ʱ�ۿ�";
				target_url = "list/shoppinglist.shtml";
				break;
		}
	}else{
		tp = MT.getTotalPrice(pay_type);
		type_info = "";
		target_url = "list/shoppinglist.shtml";
	}

	if(iConsume<=tp)
	{
		var yhq_info = "������ʹ�á�<span class='font_red'>"+sName+"</span>��,�����Ż�<span class='font_red_b font_s14'>"+denate_qb+" Q��</span></span>";
		if(tp <iDenominate)
		{
			resetPriceNum(0,MT.cur_paytype);
		}
		else
		{
			resetPriceNum(MT.getTotalPrice()-iDenominate,MT.cur_paytype);
		}
		//�۸�����ע
		CartPrice.total = MT.getTotalPrice();
		CartPrice.coupon = iDenominate;
		CartPrice.ticket = 0;
		CartPrice.reset();

//		$("#js_total_QB").html(total_qb);
//		$("#js_yhq_QB").html(denate_qb);
//		$("#js_real_QB").html(MT.Unit.transQbPrice((total_qb-denate_qb)*100));
//		$("#price_info").show();
//		$("#yhq_table").hide();
		//$("#use_yhq").removeAttr("checked");
		MT['cart_discount']['ticket'] = '';
		MT['cart_discount']['coupon_id'] = iCouponId;
		$(obj).addClass('cur');
	}
	else
	{
		var offset_num = ((iConsume-tp)/100).toFixed(2);

		var yhq_info = '<span class="bold">����'+type_info+'�����ܼ۸��� '+parseInt(iConsume)/100+' ��Q�ң�������<span class="font_red">'+offset_num+'</span>��Q�ң��Ϳ���ʹ�ø��Ż�ȯ��<a class="font_blue" target="_blank" href="'+target_url+'">ȥ�մյ�</a></span>';
		new Boxy("<p style='width:300px;text-align:center;'>"+yhq_info+"</p>",{title:"��ܰ��ʾ", closeText:" ",modal:false,width:"600px",height:"150px"});
		clearYhqCheck();
		return;
	}
	return;
};
/**
 * �����ʹ�ð�ť
 */
FormatGwd = function(){
	var gwd = globalvar.flag=='r2' ? (parseFloat($('#inptGwd').val()) || 0).toFixed(2) : (parseInt($('#inptGwd').val()) || 0);//r2������С��
	return	Math.max(Math.min(MT['cart_discount']['max_ticket']||0, gwd), 0);
}
UserGwd = function(){
	var ticket = parseInt($('.btn_use[icouponid="'+MT['cart_discount']['coupon_id']+'"]').attr('idenominate')) || 0;
	var gwd = FormatGwd();
	MT['cart_discount']['coupon_id'] = '';
	CartPrice.coupon = 0;
	CartPrice.ticket = gwd;
	CartPrice.reset();
	MT['cart_discount']['ticket'] = CartPrice.ticket;//CartPrice.reset���дCartPrice.ticket��ֵ

	//resetPriceNum(MT.getTotalPrice() - gwd, MT.cur_paytype);
//	$('#js_total_QB').html(MT.Unit.transQbPrice(MT.getTotalPrice()));
//	$('#js_yhq_QB').html(MT.Unit.transQbPrice(ticket));
//	$('#js_gwd_QB').html(MT.Unit.transQbPrice(gwd));
//	$('#price_info').show();

	return;
}
$('#inptGwd').blur(function(){
	$(this).val(FormatGwd());
});

/**
 * ��ȯʹ��
 */
UserDq = function(){
	CartPrice.dq = MT[MT.global.flag + "_dqno"];
	CartPrice.reset();
	MT['cart_discount']['dq'] = CartPrice.dq;//CartPrice.reset���дCartPrice.dq��ֵ
}

/**
 * �������Ż�ȯ����
 */
$('#btnUseYhq').click(function(){
	if($(this).children('s').is('.minus')){
		$('#bcon_yhq').hide();
		$(this).children('s').removeClass('minus');
	}else{
		$(this).children('s').addClass('minus');
		$('#btnUseGwd').children('s').removeClass('minus');
		$('#bcon_yhq').show();
		$('#bcon_gwd').hide();
		$('#inptGwd').val(MT['cart_discount']['max_ticket']);
		CartPrice.ticket = 0;
		CartPrice.reset();
		MT[MT.global.flag+"_Cart"]['gwd'] = '';
	}
});
$('#btnUseGwd').click(function(){
	if($(this).children('s').is('.minus')){
		$('#bcon_gwd').hide();
		$(this).children('s').removeClass('minus');
	}else{
		$(this).children('s').addClass('minus');
		$('#btnUseYhq').children('s').removeClass('minus');
		$('#bcon_gwd').show();
		$('#bcon_yhq').hide();
		CartPrice.coupon = 0;
		CartPrice.reset();
		MT['cart_discount']['coupon_id'] = '';
	}
});



/**
 * ���û��ʼ�����ﳵ
 * @return {null} ����
 */
initCart = function(callback, areaid, forceFresh){
	var doAction = function(list){
		MT.initCartDiscountBlock();
		if(MT.getCartNum() > 0){
			var packetListHtml = [];

			$.each(JSON_cart.list, function(k,v){
				var packetHtml = [];
				if(globalvar.flag == 'lol' && v['iType'] == 9){
					var packetList = [];
					var i = 0;
					var goodsPic = v['sGoodsPic'] ? v['sGoodsPic'].split('|').slice(1) : [];
					var goodsName = v['sGoodsName'] ? decodeURI(v['sGoodsName']).split('|').slice(1) : [];
					var checkStatus = v['sCheckStatus'] ? v['sCheckStatus'].split('|') : [];
					var code = v['sCode'] ? v['sCode'].split('|') : [];
					var priceObj = v['ext2'] ? $.parseJSON(v['ext2']) : {};

					$.each(v['sTemplateSeqId'].split('|'), function(){
						var p = priceObj[this] ? priceObj[this].split(',') : [];
						packetList.push({
							goodsPic: goodsPic[i],
							goodsName: goodsName[i],
							checkStatus: areaid ? checkStatus[i] : -1,
							checkStatusHtml: areaid ? (checkStatus[i] > 0 ? '��ӵ��' : '��') : '����ѡ�����',
							code: code[i],
							iseqid: this,
							oriPriceQb: parseFloat(p[0]/100).toFixed(2),
							disPriceQb: parseFloat(p[1]/100).toFixed(2)
						});
						i++;
					});
					if(packetList.length > 0){
						packetHtml.push(['<tr class="djgiftbox">',
							'<th scope="row"></th>',
							'<td colspan="10">',
							'<dl>',
							'<dt class="c">',
							'<span class="wth250">��������</span>',
							'<span>ԭ��</span>',
							'<span class="marl16">�ۿۼ�</span>',
							'<span>�Ƿ�ӵ��</span>',
							'</dt>'].join(''));
						$.each(packetList, function(){
							packetHtml.push(['<dd class="c '+(this.checkStatus == 1 ? ' own ' : '')+'">',
								'<span class="wth250">',
								'<a href="item/'+this.iseqid+'.shtml" target="_blank">',
								'<img src="'+this.goodsPic+'" width="39" height="39" alt="'+this.goodsName+'"></a>',
								'<a href="item/'+this.iseqid+'.shtml" target="_blank" class="link_g">'+this.goodsName+'</a>',
								'</span>',
								'<span '+(this.checkStatus == 1 ? ' class="elide" ' : '')+'>'+this.oriPriceQb+'Q��</span>',
								'<span class="marl16 '+(this.checkStatus == 1 ? ' elide red ' : '')+'">'+this.disPriceQb+'Q��</span>',
								'<span '+(this.checkStatus == 1 ? ' class="red" ' : '')+'>'+this.checkStatusHtml+'</span>',
								'</dd>'].join(''));
						});
						packetHtml.push('</dl></td></tr>');
					}

				}
				packetListHtml.push(packetHtml.join(''));
			});

			$.each(list,function(k,v){
				var award_rules = $.parseJSON(v['sAwardRule']);
				if(award_rules){
					var a_tmp = [];
					$.each(award_rules['list'],function(key,item){
						if(item.list){
							a_tmp.push(item['sPacketName']+"*"+item['iQuantity']);
						}else{
							a_tmp.push(item['sGoodsName']+"*"+item['iQuantity']);
						}
					});
					v['award_info'] = a_tmp.join(",");
				}else{
					v['award_info'] = "��";
				}
				if(!v.bPermitTicketBuy || v.bPermitTicketBuy < 2){
					MT['cart_discount']['use_ticket'] = false;
				}
				v['packetListHtml'] = packetListHtml[k];
				v['arrowHtml'] = packetListHtml[k] ? '<i class="arrow upshow"></i>' : '';
			});



			if(JSON_cart!=undefined && JSON_show_login!=undefined){
				MT['cart_discount']['max_ticket'] = parseFloat(Math.min(MT.Unit.transQbPrice(MT.getTotalUnDisPrice())/globalvar.transTicketRelate, JSON_show_login.ticket)).toFixed(2);
				$('#inptGwd').val(MT['cart_discount']['max_ticket']);
			}

			$.fillListTpl("cart_list",list);
		}else{
			$("#cart_list").html("<tr><td colspan='9'>���Ĺ��ﳵ��û�е��ߣ��Ͽ�ȥ��ѡ������ <a href='/"+globalvar.flag+"/list/shoppinglist.shtml' class='font_blue'>��Ҫ��</a></td></tr>");
			MT['cart_discount']['use_ticket'] = false;
			MT['cart_discount']['use_coupon'] = false;
		}
		MT.showCartDiscountBlock();
		if(typeof(JSON_cart)!="undefined")
		{
			var had_num = MT.getCartNum();
			var total_num = JSON_cart.iCartSize;
			var total_price = MT.Unit.transQbPrice(MT.getTotalUnDisPrice());
//            var total_real_price = MT.Unit.transQbPrice(MT.getTotalPrice());
			$("#cart_status").html("("+had_num+"/"+total_num+")");
			$("#current_num").html(had_num);
			$("#total_QB").html(total_price);
			CartPrice.total = MT.getTotalUnDisPrice();
			CartPrice.coupon = 0;
			CartPrice.ticket = 0;
			CartPrice.reset();

//			$("#js_real_QB").html(total_real_price);

			$(".gwc_num").html(had_num);
			//�������Ϣ��ʾ
			if(typeof(JSON_awards)!="undefined"){
				var award_list = getBuyAward();
				$("#award_list").html($("#order_award").tmpl(award_list));
			}
		}
		//�޸ĵ�������
		$(".cart_plus").unbind().click(function(){
			var id = $(this).attr("iSeqId");
			MT.changeGoodNumAct(id,"+",MT.global.numErrorMethod,function(data){
				initCart();
			});
			return false;
		});
		$(".cart_minus").unbind().click(function(){
			var id = $(this).attr("iSeqId");
			MT.changeGoodNumAct(id,"-",MT.global.numErrorMethod,function(data){
				initCart();
			});
			return false;
		});
		$('#cart_list .arrow').unbind('click').click(function(){
			$(this).toggleClass('upshow downhide');
			$(this).parents('tr').next('.djgiftbox').toggle();
		});
		//������������
		$("#cart_list [name=good_num]").unbind().blur(function(){
			var val = $.trim($(this).val());
			var $this = $(this);
			var id = $(this).prev(".cart_minus").attr("iSeqId");
			if(isNaN(val)||val=="0"){ alert("����д��ȷ������");$(this).val("1").focus();return;}
			MT.changeGoodNumAct(id,val,function(msg){
				alert(msg);
				$this.val(1);
			},function(data){
				initCart();
			});
		});
	};
	var _init = function(){
		MT.getCartData(function(data){
			var list = MT.parseGoodsData(MT[MT.global.flag+"_Cart"]["list"]);
			doAction(list);
			$.isFunction(callback)&&callback();
			initPayType();
			if(typeof(MT['cart_discount']['yhq_list'])!="undefined" ){
				showYhqList(MT['cart_discount']['yhq_list']);//�Ż�ȯȨ�ظ���
			}
		}, areaid);
	};

	if(typeof(MT[MT.global.flag+"_Cart"])=="undefined" || forceFresh){
		_init();
	}else{
		var list = MT.parseGoodsData(MT[MT.global.flag+"_Cart"]["list"]);
		doAction(list);
		$.isFunction(callback)&&callback();
		initPayType();
		if(typeof(MT['cart_discount']['yhq_list'])!="undefined" ){
			showYhqList(MT['cart_discount']['yhq_list']);//�Ż�ȯȨ�ظ���
		}
	}

	//�Ż�ȯ����
	//$("#price_info").hide();
	//$("#use_yhq").removeAttr("checked");
//	$("#yhq_table").hide();
};
//��ʼ��������Ϣ
initOrder = function(serialNo){
	var doOrderAction = function(deal){
		if(deal.list.length==0){
			$("#order_wrap").html("<tr><td colspan='8'>�Բ���δ�鵽�ö��������飬�뵽<a href='/center.shtml?flag="+globalvar.flag+"' class='font_blue'>��������</a>�˶�</td></tr>");
			return false;
		}
		else
		{
			//���µ�ǰ����֧�ֵ�֧����ʽ,��д��ǰҵ��֧�ֵ�֧����ʽ
			//deal.sPayTypeChannel = deal.sPayTypeChannel.replace("fastbank","tenpayquick");
			var cur_pay_type = deal.sPayTypeChannel.split("|");
			var new_pay_type = {};
			if(cur_pay_type.length>0){
				if(typeof(globalvar.pay_type)!="undefined"){
					$.each(cur_pay_type,function(k,v){
						if(typeof(globalvar.pay_type[v])!="undefined"){
							new_pay_type[v] = globalvar.pay_type[v];
						}
					});
					globalvar.pay_type = new_pay_type;//����
				}
			}

			//��䶩����Ϣ�б�
			var pay_list = $.extend({},deal);
			pay_list.totalQB = MT.Unit.transQbPrice(pay_list.iPrice);
			pay_list.iSubPayAmountQB = MT.Unit.transQbPrice(pay_list.iSubPayAmount);
			pay_list.relQB = pay_list.totalQB-pay_list.iSubPayAmountQB;
			pay_list.gwd_num = JSON_show_login.ticket||0;
			pay_list.cart_status = pay_list.list.length+"/"+(JSON_show_login.cart_size||5);
			pay_list.cur_cart_num = pay_list.list.length;
			$.each(pay_list.list,function(k,item){
				item['iPriceQB'] =  MT.Unit.transQbPrice(item.iPrice);
				item['sGoodsName'] =  item.sGoodsName.split("|")[0];
				var award_rules = $.parseJSON(item['sAwardRule']);
				if(award_rules){
					var a_tmp = [];
					$.each(award_rules['list'],function(key,v){
						if(v.list){
							a_tmp.push(v['sPacketName']+"*"+v['iQuantity']);
						}else{
							a_tmp.push(v['sGoodsName']+"*"+v['iQuantity']);
						}
					});
					item['award_info'] = a_tmp.join(",");
				}else{
					item['award_info'] = "��";
				}
			});
			pay_list['sRoleName'] = unescape(pay_list['sRoleName']);
			$("#order_wrap").html($("#order_tpl").tmpl(pay_list));
			//��������Ϣ�б�
			$("#deal_wrap").html($("#deal_tpl").tmpl(pay_list));
			//�������Ϣ��ʾ
			if(typeof(JSON_awards)!="undefined"){
				var award_list = getBuyAward();
				$("#award_list").html($("#order_award").tmpl(award_list));
			}
		}
	};
	var _init = function(serialNo){
		MT.getOrderData(serialNo,function(data){
			doOrderAction(data);
			initPayType();
			var msg = "";
			switch(JSON_order_detail.iStat)
			{
				case "-1":
				case "-2":
					msg = "������ȡ�����뵽<a class='font_blue' href='/center.shtml?flag="+MT.global.flag+"'>��������</a>���в鿴";
					break;
				case "2":
				case "0":
					msg = "������֧�����뵽<a class='font_blue' href='/center.shtml?flag="+MT.global.flag+"'>��������</a>���в鿴";
					break;
				default:
					break;
			}
			if(msg!=""){
				new Boxy('<span>'+msg+'</span>',{title:"��ܰ��ʾ",closeable:false,modal:true});
			}
		});
	};

	if(typeof(MT[MT.global.flag+"_Order"])=="undefined"){
		_init(serialNo);
	}else{
		var list = MT[MT.global.flag+"_Order"]["list"];
		doOrderAction(list);
		initPayType();
	}
};
/**
 *��ȡ�Ż�ȯ
 * @return {null} ����
 */
getYhq = function(){
	if(!parseInt(globalvar.hasYhq)){
		MT['cart_discount']['use_coupon'] = false;
	}
	MT.getYhqList(function(list){
		showYhqList(list);
	},function(list){
		if(!list || list.length == 0){
			window.MT['cart_discount']['use_coupon'] = false;
		}
		$("#no_yhq_notice").show();
	});

	MT.showCartDiscountBlock();

};
/**
 *��ȡ�������Ż�ȯ
 * @return {null} ����
 */
getOrderYhq = function(list){
	$.each(list,function(listid,counponobj){
		var iConsume = parseInt(counponobj.iConsume);//���
		var iDenominate = parseInt(counponobj.iDenominate) || 0;//���
		var sSubRule = counponobj.sSubRule.split(":");
		var sSubRules = typeof(sSubRule[1])!="undefined"?sSubRule[1].split("|"):"";
		var denate_qb = MT.Unit.transQbPrice(iDenominate),tp=0;//tp ��������ܼ�
		if(sSubRule.length>1)
		{
			switch(sSubRule[0])
			{
				case "1"://ֻ������
					$.each(sSubRules,function(k,v){
						v = parseInt(v);
						tp+=TotalPriceByType(v);
					});
					$.each(sSubRule[1].split("|"),function(k,v){
						v = parseInt(v);
						//goodTypes[v] && type_names.push(goodTypes[v]['sTypeName']);
					});
					break;
				case "2"://�������С��
					break;
				case "3"://����Ƽ�λ
					break;
				case "4":
					var currDate = JSON_sys_time.sMsg.replace(/:\d{6}/, '');
					MT[MT.global.flag+"_Cart"].list && $.each(MT[MT.global.flag+"_Cart"].list, function(){
						if(currDate < this.dtDiscountBegin || currDate >= this.dtDiscountEnd){
							tp+=parseInt(this.iPrice)*parseInt(this.iNum);
						}
					});
					break;
			}
		}else{
			tp = MT.getTotalPrice(pay_type);
		}
		if(iConsume<=tp)
		{
			list[listid].iWeight=denate_qb;
		}
		else
		{
			var offset_num = ((iConsume-tp)/100).toFixed(2);
			list[listid].iWeight=-offset_num;
		}
	});
	list = list.sort(function(a, b){
		if(b.iWeight == a.iWeight){
			if(b.iConsume == a.iConsume){
				return new Date(b.dtEndTime.replace("-", "/").replace("-", "/"))- new Date(a.dtEndTime.replace("-", "/").replace("-", "/"));
			}
			return b.iConsume- a.iConsume;
		}

		return b.iWeight- a.iWeight;
	});
	return list;

};

showYhqList=function(list){
	if(typeof(list)!=undefined){
		list=getOrderYhq(list);
		MT['cart_discount']['yhq_list'] = list;
		$(".yhq_num").html(list.length);
		$("#yhq_list").html($("#yhq_tpl").tmpl(list));
		$("#beauty_yhq").html($("#beauty_yhq_tpl").tmpl(list.slice(0,3)));
		if(list.length>0){
			$("#tab_yhq").show();
			$("#bcon_yhq").show();
			if(list[0].iWeight<0){
				$("#yhq_left_notice").show();
				$("#yhq_left_notice_num").html(Math.abs(list[0].iWeight)+'Ԫ');
			}
			else{
				window.useCoupon=((typeof(window.useCoupon)=="undefined")?0:window.useCoupon);
				$("#beauty_yhq li:eq("+window.useCoupon+")").trigger('click');
			}
			$("#no_yhq_notice").hide();
		}else{
			$("#no_yhq_notice").show();
			//$("#tab_yhq").hide();
			MT['cart_discount']['use_coupon'] = false;
		}
	}
	else{
		$("#no_yhq_notice").show();
	}
};

clearYhqCheck=function(){
	window.useCoupon=-1;
	CartPrice.coupon = 0;
	CartPrice.reset();
	$("[name='usable']").each(function(){
		$(this).removeClass("cur");
	});
};

/**
 *��ȡ�ҵĹ�ע
 * @return {null} ����
 */
getAttendGoods = function(){
	LoginManager.checkLogin(function(){
		MT.getAttendGoods(1,4,function(list){
			$.fillListTpl("attention_good",list);
		});
	});
}
/**
 * ��������
 * @return {null} ����
 */
areaSetting = function(isSend){
	//��������
	if(globalvar.areaLevel == 2) {
		$("#area").css("display", "");
		$("#iZone").css("display", "");
		eval(globalvar.zoneSelect + '.showzone2([document.getElementById("area"),document.getElementById("iZone")],[{t:"��ѡ�����",v:"",opt_data_array:[{t:"��ѡ�������",v:""}]}])');
	} else if(globalvar.areaLevel == 1){
		$("#iZone").css("display", "");
		eval(globalvar.zoneSelect + '.showzone2([document.getElementById("iZone")],[{t:"��ѡ�����",v:""}])');
	}
	if(!isSend || globalvar.iGameType!=0 && globalvar.iGameType!=3 )//������(���ﳵ)������ζ���ʾ��ɫ����������֤��ɫʱ��ʾ��ɫ
	{
		$("#iRoleId").css("display", "");
	}
}
/**
 * @author haryli
 * @version 2.0
 * @date 2012-12-15
 * @class Mutual.items
 * <p>
 * ��js���̳ǵ�ǰ��ҳ�潻�������⣬����dj_ca.js��dj_co.js��<br/>
 * ���������з������󶨵�window�����У���ֱ�ӶԷ��������е��á�<br/>
 * </p>
 * <p>
 * ������Ҫ����Ʒ�б�ҳ�ڵ���ز�������
 * </p>
 */

/**
 * ��Ʒ�б�ҳ���ѯʱ���Ҳ���������Ϣ�����ʾ��Ϣ
 * @return {null} ����
 */
noThing = function(){
	var html = "<h4 style='height:50px;line-height:50px;text-align:center'>�Բ��𣬵�ǰ�����У�û���ҵ���Ҫ��ѯ�Ľ��~~~~(>_<)~~~~���ɵ��<a style='color:#4A6D9F' href='/"+globalvar.flag+"/list/shoppinglist.shtml'>ȫ����Ʒ</a> </h4>";
	$("#shopping_list").html(html);
	$(".page_box").hide();
};
/**
 * ��ҳ�е�ҳ����ת����
 * @param {string} href ��ת����
 * @param {bool} is_default �Ƿ���������Ĭ�����ӵ���¼���Ĭ��Ϊ�����ã���ˢ��ҳ�棩
 * @return {null} ����
 */
function goto_page(href,is_default){
	if(href==""||typeof(href)=="undefined")
	{
		return;
	}

	is_default = is_default||false;

	if(is_default){
		location.href=href;
		return;
	}else{
		$.ajax({
			type:"get",
			url:href,
			data:{"r":Math.random()},
			timeout:5000,
			dataType:"html",
			async:false,
			success:function(html){
				$("#list_wrap").html(html)
			},
			error:function(){
				option.noThing();
			}
		});
		return false;
	}
};
/**
 * ͨ������ҳ��cgi���е�������
 * @param {object} option �ο�MT.showDataList�����Ĳ�������
 * @return {null} ����
 */
searchGoodsByCgi = function(option){
	option['uri'] = "http://apps.game.qq.com/cgi-bin/daoju/market/show_goods.cgi";
	if($(option.page).length==0){
		$("#list_wrap").append("<div class='page_box r'></div>");
	}
	MT.showDataList(option);
};
/**
 * �����������Զ��жϲ���ajax����ˢ��ҳ�淽ʽ����������
 * @param {object} $params_  ��������
 * @return {null} ����
 */
searchGoods = function($params_){
	//��ȡ��������
	var do_default = false;
	if(!$params_) do_default = true;

	var $pa = location.search.toQueryParams();
	var $params = $.extend($pa,$params_);
	//��ʼ��������һ���ڼ���ҳ���ʱ�����
	if(do_default){
		//��ʼ��ҳ��ؼ�ֵ
		$("#search_dj_txt").val($params.sGoodsName);
		//��ǩ���
		if($params.iTags){
			var tags = $params.iTags.split("|");
			$.each(tags,function(k,v){
				$("[name=tagbox][value="+v+"]").attr("checked","true");
			});
			if($("[name=tagbox]:checked").length>=1){
				$("#tagbox_all").removeAttr("checked");
			}
		}
	}
	//$params.iTags||$params.iWebPos||$params.iGender
	//�����������в�ѯ
	if($params.discount||$params.iWebPos||typeof($params.sGoodsName)!='undefined'||$params.iTime!='undefined'||$params.fromPrice||$params.toPrice||$params.iTags||typeof($params.ticket)!='undefined'||typeof($params.tktRet)!='undefined')
	{
		if(typeof(url_info)!="undefined"){
			if(url_info['iType'])$params['iType'] = url_info['iType'];
			if(url_info['iSubType'])$params['iSubType'] = url_info['iSubType'];
		}
		if($params.sGoodsName) $params.sGoodsName = encodeURI($params.sGoodsName);
		var option = {
			page:".page_box",
			grepFunc:function(list){
				list = MT.parseGoodsData(list);
				var nowDate = JSON_sys_time?JSON_sys_time.sMsg.split(':')[0]:$date("Y-m-d H:i:s");
				$.each(list,function(k,v){
					var date_info = [];
					v['sGoodsName_'] = v['sGoodsName'].substr(0,8);
					v['flag'] = globalvar.flag;
					v['sCode'] = escape(escape(v['sCode']));

					$.each(v['sTime'].split("|"),function(s_k,s_v){
						date_info.push($.isEmptyObject(dateTypes)?"������":dateTypes[s_v] ? dateTypes[s_v]['sTimeDesc'] : '');
					});
					v['dateInfo'] = date_info.join("|");
					v['typeInfo'] = ((typeof(goodTypes[v['iType']]) =="undefined")||$.isEmptyObject(goodTypes[v['iType']]['sTypeName']))?"�޷���":goodTypes[v['iType']]['sTypeName'];
					if(v['iPicTag']=="1"){
						v['iPicTag_class'] = "icon_hot";
					}else if(v['iPicTag']=="2"){
						v['iPicTag_class'] = "icon_new";
					}else if(v['iPicTag']=="3"||v['iDisPrice']!=v['iPrice']||(nowDate > v['dtDiscountBegin'] && nowDate < v['dtDiscountEnd'])){
						v['iPicTag_class'] = "icon_sale";
					}else if(v['iActionType']==20){
						v['iPicTag_class'] = "icon_presale";
					}else{
						v['iPicTag_class'] = "";
					}
					var wechatDiscount = globalvar.pay_type.wechat.discount;
					wechatDiscount = wechatDiscount ? wechatDiscount : 0;
					var s_num = (v['iDisPrice'] * wechatDiscount / 10000) + "";
					var isFloat = s_num.indexOf(".")!=-1;
					v['priceWechatQB'] = isFloat ? s_num.substring(0,s_num.indexOf(".")+3):s_num+".00";
				});
				return list;
			},
			success:function(){
				$(".page_box").show();
			},
			params:$params,
			tplId:"shopping_list",
			tplContId:"search_tpl"
		};
		//showgood.cgi
		searchGoodsByCgi(option);
	}
	else
	{
		var arr = {},info,url;
		if(typeof($params['sort'])=="undefined"){
			$params['sort'] = url_info['sort'];
		}
		if(typeof($params['order'])=="undefined"){
			$params['order'] = url_info['order'];
		}
		url = url_info['iType']+"-"+url_info['iSubType']+"-0-0-0-0-0-0-0-0-0-00-0-"+$params['sort']+"-"+$params['order']+"-1.shtml";
		//����̬ҳ
		goto_page(url,true);
	}
	//ҳ����ת
	$("#goto_page_btn").die().live("click",function(){
		var page_num = $("#goto_page").val();
		var total = parseInt($(".page_box ").attr("total"));
		if(isNaN(page_num)||parseInt(page_num)>total||parseInt(page_num)<1)
		{
			alert("����д��ȷ��ҳ��");
			$("#goto_page").val("").focus();
			return false;
		}
		var uri = $(".page_box ").attr("uri");
		var ext = $(".page_box ").attr("ext");
		var url = uri+page_num+"."+ext;
		goto_page(url);
		return false;
	});
	//��ҳ���Ч��
	$(".page_box a").die().live("click",function(){
		var href = $(this).attr("href");
		goto_page(href);
		return false;
	});
};

/**
 * ��ȡ��Ʒ�б�ҳ���ϵı�����
 * @return {object} ���ز�������
 */
getSearchParams = function(){
	var obj = {};
	var from = $("#from_pr").val();
	var to = $("#to_pr").val();
	if($("#from_pr").val()!="")
	{
		if(!isNaN(from)) obj.fromPrice = parseFloat(from)*100;
	}
	if($("#to_pr").val()!="")
	{
		if(!isNaN(to)) obj.toPrice = parseFloat(to)*100;
	}
	if($("#search_dj_txt").val()!="")
	{
		obj.sGoodsName =  $("#search_dj_txt").val();
	}
	if($('#search_iTime').val()!=''){
		obj.iTime = $('#search_iTime').val();
	}
	var tags_ = [],tags="";
	$("[name=tagbox]:checked").each(function(v){
		tags_.push($(this).val());
	});
	tags = tags_.join("|");
	if($("[name=tagbox]:checked").length>0){
		$("#tagbox_all").removeAttr("checked");
	}else{
		$("#tagbox_all").attr("checked",true);
	}
	if($("#all_fashion").is(":checked")){
		obj.ticket = 1;
	}
	if($("#arms_fashion").is(":checked")){
		obj.tktRet=1;
	}

	obj.iTags = tags;
	return obj;
};

/**
 * @author haryli
 * @version 2.0
 * @date 2012-12-15
 * @class Mutual.detail
 * <p>
 * ��js���̳ǵ�ǰ��ҳ�潻�������⣬����dj_ca.js��dj_co.js��<br/>
 * ���������з������󶨵�window�����У���ֱ�ӶԷ��������е��á�<br/>
 * </p>
 * <p>
 * ������Ҫ������ҳ���ڵ���ز�������
 * </p>
 */

/**
 * �������div����
 * @param {object} html ҳ��domԪ��
 * @param {object} data_info ��Ҫ�������ݶ���
 * @return {object} ���ز�������
 */
fillSendDiv = function(html,data_info){
	$(html).appendTo("#hidden_div");
	$.fillListTpl("sg_inner",data_info,function(){
		//�ص�
		//������������
		$("#s_minus_num").unbind("click").click(function(){
			var cur_num = $("#send_num").val();
			if(cur_num<=1){alert("�����ټ���");return;}
			var buy_num = parseInt($("#buy_num").val());
			var cur_no = --buy_num;
			$("#send_num").val(cur_no);
		});
		$("#s_plus_num").unbind("click").click(function(){
			var cur_num = $("#send_num").val();
			var max_num = parseInt($("#send_num").attr("max_num"));
			if(cur_num>=max_num) {
				alert("�õ��ߵ�����๺��"+max_num+"��");return;
			}
			var cur_no = parseInt($("#send_num").val())+1;
			$("#send_num").val(cur_no);
		});
		$("#send_num").unbind().blur(function(){
			var max_num = parseInt($(this).attr("max_num"));
			var val = $.trim($(this).val());
			if(isNaN(val)||val=="0"){ alert("����д��ȷ������");$(this).val("1").focus();return;}
			if(parseInt(val)>max_num) {alert("�õ��ߵ�����๺��"+max_num+"��"); $(this).val(max_num);return;}
		});
		//��������
		areaSetting(1);

		$("#iZone").change(function(){
			if($("#send_QQ").val()==LoginManager.getUserUin()){alert("�������͸��Լ�");$("#send_QQ").focus().select();return;}
			if(globalvar.iGameType!=0 && globalvar.iGameType!=3){
				changeEvent(this,1);
			}
		});

		new Boxy($("#send_good_box"),{title:"���͵���",
			closeText:" ",modal:true,"afterHide":function(){
				$(".boxy-wrapper iframe").remove();
			},"afterShow":function(){
				$("#send_QQ").focus();
			}});
	});
};

/**
 *  ��乺��div����
 * @param {object} html ҳ��domԪ��
 * @param {string} id ��ǰ�����б��У�id��Ӧ���Ǹ�����
 * @return {null}
 */
fillActBuyDiv = function(html,id){
	$(html).appendTo("#hidden_div");
	$.fillListTpl("sg_inner",good_info[id],function(){
		//����ѡ��
		areaSetting();

		$("#iZone").change(function(){
			changeEvent(this);
		});
		//������������
		$("#s_minus_num").unbind("click").click(function(){
			var buy_num = parseInt($("#buy_num").val());
			if(buy_num<=1){alert("�����ټ���");return;}
			var cur_no =--buy_num;
			$("#buy_num").val(cur_no);
		});
		$("#s_plus_num").unbind("click").click(function(){
			var cur_num = $("#buy_num").val();
			var max_num = parseInt($("#buy_num").attr("max_num"));
			if(cur_num>=max_num&&max_num!=0) {
				alert("�õ��ߵ�����๺��"+max_num+"��");return;
			}
			var cur_no = parseInt($("#buy_num").val())+1;
			$("#buy_num").val(cur_no);
		});
		$("#buy_num").unbind().blur(function(){
			var max_num = parseInt($(this).attr("max_num"));
			var val = $.trim($(this).val());
			if(isNaN(val)||val=="0"){ alert("����д��ȷ������");$(this).val("1").focus();return;}
			if(parseInt(val)>max_num&&max_num!=0) {alert("�õ��ߵ�����๺��"+max_num+"��"); $(this).val(max_num);return;}
		});
		window.act_buy_box = new Boxy($("#buy_good_box"),{title:"�������",
			closeText:" ",modal:true,"afterHide":function(){
				$(".boxy-wrapper iframe").remove();
			}});
	});
};
/**
 *  ͳ�Ʒ�������
 * @param {object} curobj domԪ�ء�����Ҫ����ַ��Ŀռ�Ԫ��
 * @return {null}
 */
count_words = function(curobj){
	var len = parseInt(curobj.value.length);
	if(len >= 108){
		alert("�Բ���������̫��������....");
		curobj.value = curobj.value.cutChinese(106+parseInt(curobj.value.getChineseNum()),"");
	}
	var curlen = 108-parseInt(curobj.value.length);
	$("#limit_num").html(curlen);
}
/**
 *  ���wb����div����
 * @param {object} html  html domԪ��
 * @param {object} data_info ��Ҫ�������ݶ���
 * @return {null}
 */
fillShareDiv = function(html,data_info){
	$(html).appendTo("#hidden_div");
	$.fillListTpl("share_alert",data_info,function(){
		$("#share_btn").click(function(){
			$(".boxy-wrapper .close").trigger("click");
			var $form = $(this).parents("form");
			var url = $form.attr("action")+"?"+encodeURI($form.serialize())+"&url="+location.href.toString()+"&r="+ $.time();
			$.getScript(url,function(){
				if ('undefined' != typeof(JSON_share_goods)&&JSON_share_goods.iRet=="0"){
					msg = "�Ѿ��ɹ���������΢��";
				}else{
					msg = JSON_share_goods.sMsg||"ϵͳ��æ�������Ժ����ԣ�"
				}
				new Boxy("<p>"+msg+"</p>",{title:"��ܰ��ʾ", closeText:" ",modal:true});
			});
			return false;
		});
		new Boxy($("#share_alert"),{title:"΢������",
			closeText:" ",modal:true});
	});
};

/**
 *  vip���򵯲㡪���
 * @param {string} id ���ߵ�iSeqId
 * @param {string} vip vip���ͣ�qq��blue
 * @param {function} notVipFunc �������vip����ʾ��������
 * @return {null}
 */
showVipBuyBox = function(id,vip,notVipFunc){
	if(!LoginManager.isLogin()){
		LoginManager.submitLogin(function(){
			showVipBuyBox(id,vip);
		});
		return;
	}
	MT.isVip({
		"vip":vip,
		"callback":function(data){
			if(data.iRet=='0'){
				if(eval("data."+vip)!='0'){
					showBuyBox(id);
				}else{
					if($.isFunction(notVipFunc)){
						notVipFunc.call(this,data);
					}
				}
			}else{
				new Boxy("<div>ϵͳ��æ�����Ժ�����</div>",{title:"��ܰ��ʾ",closeText:" ",modal:true});
			}
		}
	});
};

/**
 *  �������򵯲�
 * @param {string} id ���ߵ�iSeqId
 * @return {null}
 */
showBuyBox = function(id){
	if(!LoginManager.isLogin()){
		LoginManager.submitLogin(function(){
			showBuyBox(id);
		});
		return;
	}
	if($("#buy_good_box").length>0){
		$("#safety_form").attr({"height":"0","src":"about:blank"}).empty();
		fillActBuyDiv($("#buy_good_box"),id);
		window.buy_good_box = $("#buy_good_box").clone();
	}else{
		if(typeof(window.buy_good_box)!="undefined"){
			$("body").append(window.buy_good_box);
			$("#safety_form").attr({"height":"0","src":"about:blank"}).empty();
			fillActBuyDiv($("#buy_good_box"),id);
		}else{
			$.get("buy_good.inc?r="+Math.random(),function(data){
				$("#safety_form").attr({"height":"0","src":"about:blank"}).empty();
				fillActBuyDiv(data,id);
				window.buy_good_box = $("#buy_good_box").clone();
			},"html");
		}
	}
}
/**
 *  ��ӹ��ﳵ����
 * @param {string} id ���ߵ�iSeqId
 * @return {null}
 */
buyGood = function(id){
	var num = $("#buy_num").val();
	if(isNaN(num)) {alert("������д����");return false;}
	MT.buyGood(id,num,1);
};
/**
 *  ����΢��
 * @param {string} id ���ߵ�iSeqId
 * @return {null}
 */
shareWb = function(id){
	var goodinfo = typeof(window.good_list)!="undefined"?window.good_list[id]:good_info;
	//$.get("share_wb.inc?r="+Math.random(),function(data){
	if($("#share_alert").length>0){
		goodinfo['provideQQ'] = LoginManager.getUserUin();
		fillShareDiv($("#share_alert"),goodinfo);
		window.share_alert = $("#share_alert").clone();
	}else{
		$("body").append(window.share_alert);
		goodinfo['provideQQ'] = LoginManager.getUserUin();
		fillShareDiv($("#share_alert"),goodinfo);
	}
	//},"html");
}
/**
 *  ���͵��ߵ���
 * @param {string} id ���ߵ�iSeqId
 * @return {null}
 */
showSendBox = function(id){
	var goodinfo = typeof(window.good_list)!="undefined"?window.good_list[id]:good_info;
	if(!LoginManager.isLogin()){
		LoginManager.submitLogin(function(){
			showSendBox(id);
		});
		return;
	}
	if($("#send_good_box").length>0){
		window.send_good_box = $("#send_good_box").clone();
		goodinfo['provideQQ'] = LoginManager.getUserUin();
		$("#safety_form").attr({"height":"0","src":"about:blank"}).empty();
		fillSendDiv($("#send_good_box"),goodinfo);

		$.getScript('http://daoju.qq.com/time/v3/mall/'+window.globalvar.flag+'/js/ad/biz_give.js', function(){//��ά����
			var data = window.biz_give_adlist;
			if(data && data[0]){

				var $djcodebox = $("#send_good_box .djcodebox");
				$djcodebox.find('a').attr('href', data[0].sLink);
				$djcodebox.find('img').attr('src', data[0].sPicLink);
				$djcodebox.show();
			}
		});

	}else{
		$("body").append($(window.send_good_box).clone());
		goodinfo['provideQQ'] = LoginManager.getUserUin();
		$("#safety_form").attr({"height":"0","src":"about:blank"}).empty();
		fillSendDiv($("#send_good_box"),goodinfo);
	}
}
/**
 *  ��ʾ������ʷ��¼
 * @param {string} id ���ߵ�iSeqId
 * @return {null}
 */
initShowHist = function(){
	var goodinfo = typeof(window.good_info_)!="undefined"?window.good_info_[0]:window.cur_good;
	var params = {
		sCode:goodinfo['sCode'],
		sSendType:goodinfo['sSendType']
	};
	var option = {
		uri:"http://apps.game.qq.com/cgi-bin/daoju/market/goods_buy_hist.cgi",
		page:".page_box",
		params:params,
		tplId:"buy_hist",
		jsonp:"JSON_goods_buy_hist",
		noThing:function(){
			$("#buygood_hist").html("<p>��ʱû����ؼ�¼</p>");
		}
	};
	MT.showDataList(option);
}

/**
 *  �ֱ������
 * @param {object} obj ֱ���ĵ��߶���ʵ��
 * @return {null}
 */
actBuyGood = function(obj){
	if($("#iZone").is(":visible")&&$("#iZone").val()==""){alert("��ѡ������");return;}
	if($("#iRoleId").is(":visible")&&$("#iRoleId").val()==""){alert("��ѡ���ɫ");return;}
	var pay_type = $("[name=payType]:checked").val();
	if($("#payUnion").is(":checked")){
		switch(pay_type) {
			case "qb":
				$("#sPayType").val("qbqp");
				break;
			case "qp":
				$("#sPayType").val("qpqb");
				break;
			default:
		}
	}else{
		$("#sPayType").val(pay_type);
	}

	$("#sg_inner").hide();
	var form_info = $("#buy_good").attr("action")+"?"+$("#buy_good").serialize();
	$("#safety_form").attr("src",form_info);
	$("#safety_form").attr("height","300px");
	$("#buy_good_box").attr("height","300px");
}

/**
 *  ���͵���
 * @param {object} obj ֱ���ĵ��߶���ʵ��
 * @return {null}
 */
sendGood = function(obj){
	if(!$("#send_QQ").val().isQQ()) {alert("����д��ȷ��QQ����");return;}
	if(isNaN($("#send_num").val())) {alert("������д����");return;}
	if($("#iZone").is(":visible")&&$("#iZone").val()==""){alert("��ѡ������");return;}
	if($("#iRoleId").is(":visible")&&$("#iRoleId").val()==""){alert("��ѡ���ɫ");return;}
	if($("#send_QQ").val()==LoginManager.getUserUin()){alert("�������͸��Լ�");$("#send_QQ").focus().select();return;}

	if(globalvar.iGameType!=0&&globalvar.iGameType!=3)
	{
		if($("#iRoleId").val()==""){
			alert("��ǰ����û�н�ɫ����ѡ���н�ɫ�Ĵ���");return;
		}
	}
	//��ť����
	$("#send_good_btn").attr("href","javascript:;");
	$("#send_good_btn").attr("class","btn_goods_waiting ht clear l");

	var pay_type = $("[name=payType]:checked").val();
	$("#iPayType").val(pay_type);
	$("#ProvideUin").val($("#send_QQ").val());
	//$("#sg_inner").hide();
	//var buygood_url = "http://apps.game.qq.com/cgi-bin/daoju/v3/api/mall/mall_buy.cgi";
	var match =  /rec_info=([^&]+)/i.exec(window.location.search);
	var rec_info = match ? match[1] : '';

	var param_a = {
		'_app_id':1003,
		'_plug_id':7000,
		"_biz_code": globalvar.flag,
		'_ver': 'v2',
		'tradeType':1,
		"areaid":$("#iZone").val(),
		'getUin':$("#send_QQ").val(),
		'buynum':$("#send_num").val(),
		'propid':$('#send_good input[name="iGoodsSeqId"]').val(),
		"needVip":'0',
		'rec_info':rec_info,
		"r":Math.random()
	};

	if($("#iRoleId").val()){
		param_a.roleid = $("#iRoleId").val();
		param_a.rolename = $("#iRoleId").find('option[value="'+$("#iRoleId").val()+'"]').html();
	}
	$.getScript('http://apps.game.qq.com/cgi-bin/daoju/v3/hs/i_buy.cgi?' + $.param(param_a), function(){
		$(".boxy-wrapper .close").trigger("click");
		$("#send_good_btn").attr("href","javascript:sendGood(this);");
		$("#send_good_btn").attr("class","btn_goods_handsel ht clear l");
		var json = i_buy;
//		json.msg = Utf8ToUnicode(json.msg);
		var msg = "";
		switch(json.ret){
			case "0":
				cloudPay2(json.serial);
				break;
			case 'xxxx':
				//����ȡ������
				break;
			default:
				msg = "<div class='submit_con'><h2>��������ʧ��</h2><br/>"+json.msg+"<br/><a href='javascript:;' onclick='order_box.hide();' class='btn_order' title='�ر�'>�ر�</a></div>"
				break;
		}
		if(json.ret!="0"){
			window.order_box = new Boxy(msg,{title:"��ܰ����", closeText:" ",modal:true});
		}
	});
	return;
//	var url = $("[name=send_good]").attr("action")+"?"+$.param($("[name=send_good]").serializeArray());
//
//	if(url!=$("#safety_form").attr("src")){
//		$("#safety_form").attr("src",url);
//	}
//	$("#safety_form").attr("height","300px");
//	$("#send_good_box").attr("height","300px");
}

/**
 *  ������Ϣ���
 * @param {object} data ���ߵ���������
 * @return {null}
 */
initDetailDesc = function(data){
	var data = data||good_info[0];
	var url = "good_rmd_"+data['iSeqId']+".inc?r="+Math.random();
	//��ȡ������Ϣ
	var htm = $.trim($("#good_desc").html().replace("&nbsp;",""));
	if(htm==""){
		$("#good_desc").css("opacity",0).html(data["sDesc"]).stop().animate({"opacity":1},400);
	}
};
/**
 *  ��ʼ������ҳ��Ϣ
 * @param {object} data ���ߵ�������Ϣ����
 * @param {function} callback �ص�����
 * @return {null}
 */
initDetailInfo = function(data,callback){
	var data = data||good_info[0];
	$.fillListTpl("detail_info",data,function(){
		//�ص�
		//���ɾ�������¼���
		$("#minus_num").unbind("click").click(function(){
			var cur_num = parseInt($("#buy_num").val());
			if(cur_num<=1){alert("�����ټ���");return;}
			$("#buy_num").val(--cur_num);
			return false;
		});
		$("#plus_num").unbind("click").click(function(){
			var cur_num = parseInt($("#buy_num").val());
			var max_num = parseInt($("#buy_num").attr("max_num"));
			if(cur_num>=max_num) {
				alert("�õ��ߵ�����๺��"+max_num+"��");return;
			}
			$("#buy_num").val(++cur_num);
			return false;
		});
		//������������
		$("#buy_num").blur(function(){
			var max_num = parseInt($(this).attr("max_num"));
			var val = $.trim($(this).val());
			if(isNaN(val)||val=="0"){ alert("����д��ȷ������");$(this).val("1").focus();return;}
			if(parseInt(val)>max_num) {alert("�õ��ߵ�����๺��"+max_num+"��"); $(this).val(max_num);return;}
		});
		//��ʾ��ͼ
		$(".btn_goods_zoom").fancyZoom({scaleImg: true, closeOnClick: true,directory:"http://ossweb-img.qq.com/images/gameshop/ui/zoom_img/images/"});
		//�ص�
		if($.isFunction(callback)){
			callback();
		}
	});
	//��Ӵ�ͼ����
	$("#big_img img").attr("src",data["big_img"]);
};

/**
 *  �����Ƽ�
 * @param {number} id ����iSeqId
 * @param {function} callback �ص�����
 * @return {null}
 */
fillRqRecInfo = function(id,callback){
	var url = "http://daoju.qq.com/time/market/js/"+globalvar.flag+"/rq_rec.js?r="+Math.random();
	$.getScript(url,function(){
		if(!rq_rank){
			//û����������
			return false;
		}
		if(rq_rank.length==0){
			//û����������
			return false;
		}
		rq_rank = MT.parseGoodsData(rq_rank)
		$.each(rq_rank,function(k,v){
			v['sGoodsName_'] = v['sGoodsName'].substr(0,8);
			v['flag'] = globalvar.flag;
			v['sCode'] = escape(escape(v['sCode']));
			if(v['iPicTag']=="1"){
				v['iPicTag_class'] = "icon_hot";
			}else if(v['iPicTag']=="2"){
				v['iPicTag_class'] = "icon_new";
			}else if(v['iPicTag']=="3"||v['iDisPrice']!=v['iPrice']){
				v['iPicTag_class'] = "icon_sale";
			}
		});
		$.fillListTpl(id,rq_rank,function(){
			$("#"+id).show();
			//�ص�
			if($.isFunction(callback)){
				callback();
			}
		});
	});
};

/**
 * @author haryli
 * @version 2.0
 * @date 2012-12-15
 * @class Mutual.common
 * <p>
 * ��js���̳ǵ�ǰ��ҳ�潻�������⣬����dj_ca.js��dj_co.js��<br/>
 * ���������з������󶨵�window�����У���ֱ�ӶԷ��������е��á�<br/>
 * </p>
 * <p>
 * ����������̳�ҳ����֧��
 * </p>
 */

/**
 *  ��������
 * @return {null}
 */
setHeaderSearch = function()
{
	$("#header_btn_search").bind("click", function(){
		var val = $.trim($("#header_txt_search").val());
		if(val == "������߽�������") val = "";
		if(val==""){
			window.location.href = "/"+globalvar.flag+"/list/shoppinglist.shtml";
		}else{
			window.location.href = "/"+globalvar.flag+"/list/search?sGoodsName=" + escape(val);
		}
		return false;
	});

	$("#header_txt_search").keydown(function(e){
		if(e.keyCode==13){
			$("#header_btn_search").click();
		}
	});
}
/**
 * �����л�������ͬmilo��unserialize
 */
milo_unSerialize = function(jsonStr, de){
	de = de || 0;
	jsonStr = jsonStr.toString();
	if (!jsonStr) return {};
	var retObj = {},
			obj1Ret = jsonStr.split('&');
	if (obj1Ret.length == 0) return retObj
	for (var i = 0; i < obj1Ret.length; i++) {
		if (!obj1Ret[i]) continue;
		var ret2 = obj1Ret[i].split('=');
		if (ret2.length >= 2) {
			var ret0 = obj1Ret[i].substr(0, obj1Ret[i].indexOf('=')),
					ret1 = obj1Ret[i].substr(obj1Ret[i].indexOf('=') + 1);
			if (!ret1) ret1 = '';
			if (ret0) retObj[ret0] = de == 0? decodeURIComponent(ret1) : ret1;
		}
	}
	return retObj;
}

/**
 * ����query_role.cgi�ķ���ֵ
 */
getRoleResult = function(query_role_result) {
	try{

		var map = milo_unSerialize(query_role_result.data, 1);
		if(map['_webplat_msg_code']){
			if(map['_webplat_msg_code']*1 == 1 || map['_webplat_msg_code']*1 == -100){
				//throw '�ڸ÷�������δ��ȡ����ɫ��Ϣ��';
				return [];
			}
			if(map['_webplat_msg_code']*1 != 0){
				//throw '��ѯ�������࣬�����Ժ����ԣ�';
				return -1;
			}
		}

		var roleId = LoginManager.getUserUin();
		if(!roleId){
			return -2;
		}

		var _arrRole = map['_webplat_msg'];
		if(!_arrRole){
			return [];
		}
		_arrRole = _arrRole.split('|');
		if(_arrRole.length == 1){
			return [];
		}else{
			var _arrRoleList = [];
			for(var i = 1; i < _arrRole.length; i++){
				if(_arrRole[i]){
					var _oneArray = _arrRole[i].split(" ");
					if(_oneArray.length >= 2){
						_arrRoleList.push({
							'roleId' : _oneArray[0],
							'roleName' : htmlentities(decodeURIComponent(_oneArray[1])),
							'roleNameUtf8' : _oneArray[1]
						});
					}
				}
			}
			return _arrRoleList;
		}
	}catch(e){
		alert(e);
		return false;
	}
}

/**
 * �����ַ�תΪhtmlʵ��
 */
function htmlentities(str){
	return str.replace(/^<|>|\'|\"$/g, function(c){
		return '&#' + c.charCodeAt() + ';';
	});
}

/**
 *  ����ѡ���Ľ�������
 * @param {number} id ����iSeqId
 * @param {function} isSend �ص�����
 * @return {null}
 */
changeEvent = function(obj,isSend)
{
	//if(globalvar.iGameType!=0&&globalvar.iGameType!=3)
	//{
	var uin = $.trim($("#send_QQ").val());
	if(isSend){
		if(!uin.isQQ()){
			alert("������д����QQ��");
			return;
		}
	}
	MT.showRole(obj.value,uin,function(json){
		window.roleInfo = {};
		if(typeof(query_role_result)!="undefined")
		{
			$("#iRoleId").empty();

			roleArray = getRoleResult(json);

			if(roleArray === -1){
				$("#error_info").html( "��ѯ�������࣬�����Ժ����ԣ�");
				$("#iRoleId").html("<option value=''></option>");
			}else if(roleArray === -2){
				$("#error_info").html( "��¼״̬��ʧ�������µ�¼�����ԣ�");
				$("#iRoleId").html("<option value=''></option>");
			}else if(roleArray === false){
				$("#error_info").html( "�Բ���, ��ɫ��ѯ����");
				$("#iRoleId").html("<option value=''></option>");
			}else if(json.retCode == '0' && roleArray && roleArray.length){
				$.each(roleArray,function(k,v){
					window.roleInfo[this.roleId] = this.roleNameUtf8;
					$("#iRoleId").append("<option value="+this.roleId+">"+this.roleName+"</option>");
				});
				$("#error_info").html('');
				initCart(function(){}, obj.value, true);
			}else if(json.retCode=="-1" || json.retCode=="-2"){
				$("#error_info").html('');
				alert(json.msg);
			}else{
				$("#error_info").html( "��ǰ����û�����Ľ�ɫ");
				$("#iRoleId").html("<option value=''>��ǰ�����޽�ɫ</option>");
			}
		}

		if(typeof(JSON_list_role)!="undefined")
		{
			$("#iRoleId").empty();
			if(JSON_list_role.iRet=="0"){
				var list = $.parseData(JSON_list_role.list);
				$("#iRoleId").empty();
				$.each(list,function(k,v){
					window.roleInfo[v['id']] = v["name"];
					$("#iRoleId").append("<option value="+v['id']+">"+decodeURI(v["name"])+"</option>");
				});
				initCart(function(){}, obj.value, true);

			}else if(JSON_list_role.iRet=="-1"){
				alert(JSON_list_role.sMsg);
			}else{
				$("#error_info").html( "��ǰ����û�����Ľ�ɫ");
				$("#iRoleId").html("<option>��ǰ�����޽�ɫ</option>");
			}
		}
	});

	//}
}

/**
 * ע������
 * @return {null}
 */
loginOut = function(){
	LoginManager.logout(function(){
		$("#logined_index").hide(0,function(){
			$("#unlogin_index").show();
		});
		$("#logined").hide(0,function(){
			$("#unlogin").show();
		});
	});
}
/**
 *  ��û��ˢ��ҳ���ʱ��ͨ���������������ҳ��
 * @return {null}
 */
doLogin = function(){
	$E("#login_qq_span").innerHTML = LoginManager.getUserUin();
	if($("#unlogin_index").length>0){
		$("#unlogin_index").hide();
		$("#logined_index").show();
		$("#login_qq_span_index").html(LoginManager.getUserUin());
		$(".gwd_num").html(JSON_show_login.ticket||'0.00');
		$("#gwd_num").html(JSON_show_login.ticket||0);
		if(JSON_cart!=undefined && JSON_show_login!=undefined){
			MT['cart_discount']['max_ticket'] = parseFloat(Math.min(MT.Unit.transQbPrice(MT.getTotalUnDisPrice())/globalvar.transTicketRelate, JSON_show_login.ticket)).toFixed(2);
			$('#inptGwd').val(MT['cart_discount']['max_ticket']);
		}
		if(JSON_show_login.ticket <= 0){
			MT['cart_discount']['use_ticket'] = false;
			MT.showCartDiscountBlock();
		}

		LoginManager.getUserFace(function(faceInfo){
			$("#face_img").attr("src",faceInfo.userFace);
		});
	}
	//��ȡ�û���ʼ������
	MT.getLoginInfo(function(){
		//���¹��ﳵ����
		$(".gwc_num").html(MT.getCartNum());
	});
}

/**
 *  �ڴ��ڴ�����
 *  @param {string} url
 * @return {null}
 */
openwin = function(url){
	var a_str = "<a href="+url+" target='_blank' />";
	$(a_str).appendTo("body").end().trigger("click");
}

/**
 *  ͼƬ�����޸ĺ���
 *  @param {string} url
 *  @param {string} append �ļ�����Ҫ���ӵ��ַ�
 *  @param {string} a_dir �ļ�·����Ҫ��ӵ���Ŀ¼
 *  @return {null}
 */
mkp = function(url,append,a_dir){
	if(typeof(a_dir)=="undefined")a_dir="";
	if(typeof(append)=="undefined")append="";
	var uri = url.split(".");
	var ext = uri.pop();
	var dir = uri.join(".").split("\/");
	var pre_name = dir.pop();
	var pre_uri = dir.join("/");
	return pre_uri+"/"+a_dir+"/"+pre_name+append+"."+ext;
}

/**
 *  ��ʼ����Ѷ��Ϸ
 *  @return {null}
 */
initGameArea = function(){
	var url = "http://daoju.qq.com/time/big_mall/js/game_file.js";
	var st;
	$.getScript(url,function(){
		$.each(BigMall_game,function(k,game){
			var lis = "";
			//hot new
			$.each(game.games,function(k,v){
				var waterMark = "";
				if(v.iWatermark=="1"){
					waterMark = "<span class='icon_hot'></span>";
				}else if(v.iWatermark=="2"){
					waterMark = "<span class='icon_new'></span>";
				}
				if(k==(game.games.length-1)){
					lis+= '<li class="bb br"><a href="/'+v['sBzCode']+'" class="spr icon_comm" title="'+v['sName']+'"><img src="'+v['sLogoLink']+'" align="absmiddle"/>'+v['sName']+'</a>'+waterMark+'</li>';
				}else{
					lis+= '<li class="br"><a href="/'+v['sBzCode']+'" class="spr icon_comm" title="'+v['sName']+'"><img src="'+v['sLogoLink']+'" align="absmiddle"/>'+v['sName']+'</a>'+waterMark+'</li>';
				}
			});
			game.lis = lis;
		});
		$.fillListTpl("games_info",BigMall_game);
		$('#game_menu').mouseenter(function() {
			if (st)clearTimeout(st);
			$('#game_layer').show();
			$('#game_layer').hover(function() {
				if (st)clearTimeout(st);
				$(this).show();
			}, function() {
				$(this).hide();
			});
		}).mouseleave(function() {
			st = setTimeout(function() {
				$('#game_layer').hide();
			}, 500);
		});
		$(".product_list li").hover(function(e) {
			$(this).css({
				"background" : "#d8d8d8"
			})
		}, function() {
			$(this).css({
				"background" : "none"
			})
		});
	});
}

/**
 *  ����ҳ��
 *  @param {string} url
 *  @return {null}
 */
openUrl = function( url ){
	var f = document.createElement("a");
	f.setAttribute("href" , url );
	f.setAttribute("target" , '_black' );
	document.body.appendChild(f);
	f.click();
}
/**
 *  ��������ҳ��չʾ
 *  @param {string} id
 *  @param {function} callback
 *  @param {option} option
 *  @return {null}
 */
makeHotRank  = function(id,callback,option){
	var setting = $.extend({
		show:"slideDown",
		time:500
	},option);
	var url = "http://daoju.qq.com/time/market/js/"+globalvar.flag+"/rankinfo.js?v="+Math.random();
	$.getScript(url,function(){
		if(typeof(hot_rank)=="undefined"){
			$("#hot_rank .loading_panel").fadeOut(500).append("�����ڴ�");
		}
		var new_list = [];
		$.each(hot_rank,function(k,item){
			var index_k = k+1;
			var temp = MT.parseGoodsData([item['sGoodsExtInfo']||item])[0];
			temp['business_name'] = globalvar.pname;
			temp['sGoodsName'] = item['sGoodsName'].substr(0,8);
			temp['iRank'] = index_k<10?"0"+index_k:index_k;
			temp['icon_class_big'] = parseInt(index_k)>3?"icon"+4:"icon"+1;
			temp['icon_class_small'] = parseInt(index_k)>3?"icon"+3:"icon"+2;
			temp['display_big'] = k!=0?"none":"block";
			temp['display_small'] = k==0?"none":"block";
			temp['flag'] = globalvar.flag;
			temp['iWechatDiscount']  = globalvar.pay_type.wechat ? globalvar.pay_type.wechat.discount : 0;
			var s_num = (temp['iWechatDiscount'] * temp['iDisPrice'] / 10000) + "";
			var isFloat = s_num.indexOf(".")!=-1;
			temp['priceWechatQB'] = isFloat ? s_num.substring(0,s_num.indexOf(".")+3):s_num+".00";
			new_list.push(temp);
		});

		$("#hot_rank .loading_panel").fadeOut(500);
		$.fillListTpl(id,new_list,function(){
			$('.bx_top').find('.bx_top_small').bind('mouseenter', function() {
				$('.bx_top').find('.bx_top_big').hide();
				$('.bx_top').find('.bx_top_small').show();
				$(this).hide();
				$(this).prev('.bx_top_big').eq(0).show();
			});
			//�ص�
			if($.isFunction(callback)){
				callback();
			}
		},true,null,setting);
	});
}
/**
 *  ���ﳵ��������
 *  @param {string} id
 *  @param {function} callback
 *  @param {option} option
 *  @return {null}
 */
makeWeekHot  = function(id,callback,option){
	var url = "http://daoju.qq.com/time/market/js/"+globalvar.flag+"/rankinfo.js?v="+Math.random();
	$.getScript(url,function(){
		if(typeof(hot_rank)=="undefined"){
			$("#"+id).html("�����ڴ�");
		}
		var new_list = [];
		$.each(hot_rank,function(k,item){
			if(k>3) return false;
			var temp = MT.parseGoodsData([item['sGoodsExtInfo']||item])[0];
			temp['business_name'] = globalvar.pname;
			temp['iRank'] = item['iRank'];
			temp['display_big'] = k!=0?"none":"block";
			temp['display_small'] = k==0?"none":"block";
			new_list.push(temp);
		});
		$.fillListTpl(id,new_list,function(){
			//�ص�
			if($.isFunction(callback)){
				callback();
			}
		});
	});
}
/**
 * �����ർ��
 *  @return {null}
 */
makeSidebar = function(){
	var str=  '';
	$.each(allTypes,function(k,sidebar){
		if(sidebar.count>0){
			str+='<div class="sidelist">\
			<span><span class="ico_side_item"></span>\
			<h3 class="border_line">\
					<a href="/'+globalvar.flag+'/list/'+sidebar.iType+'-0-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml">'+sidebar.sTypeName+'('+sidebar.count+')</a>\
			</h3>';
			if(sidebar.subtypes.length>0||sidebar.tags){
				str+='<em class="ico_sidelist_ext"></em>';
			}
			str+='</span>';
			if(sidebar.subtypes.length>0){
				str+='<div class="i-list"><div class="i-list-details"><ul><li>';
				$.each(sidebar.subtypes,function(k_s,st){
					if(st.count>0){
						str+='<span>'+(k_s==0?'':'|')+'<a href="/'+globalvar.flag+'/list/'+sidebar.iType+'-'+st.iSubType+'-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml">'+st.sSubTypeName+'</a></span>';
					}
				});
				str+='</li></ul></div><div class="i-list-other"><h4>'+sidebar.sTypeName+'</h4><ul>\
				<li>���е��� '+sidebar.count+' ��</li><li>���Ե������ǩ��������ѯ</li></ul></div></div>';
			}else{
				if(sidebar.tags){
					str+='<div class="i-list"><div class="i-list-details"><ul><li>';
					$.each(sidebar.tags,function(k_s,tag){
						str+='<span>'+(k_s==0?'':'|')+'<a href="/'+globalvar.flag+'/list/'+tag.iGoodsType+'-'+tag.iGoodsSubType+'-0-0-0-0-0-0-0-0-0-'+tag.iTagId+'-0-0-1-1.shtml">'+tag.sTagName+'</a></span>';
					});
					str+='</li></ul></div><div class="i-list-other">\
							<h4>'+sidebar.sTypeName+'</h4>\
							<ul>\
								<li>���е��� '+sidebar.count+' ��</li>\
								<li>���Ե������ǩ��������ѯ</li>\
							</ul></div></div>';
				}
			}
			str+='</div>';
		}
	});
	$("#sidebar").append(str);
	var objSide;
	$('.menu_box .title_comm').mouseenter(function() {
		if (objSide)
			clearTimeout(objSide);
		$('#sidebar').show(10);
		$('#sidebar').hover(function() {
			if (objSide)
				clearTimeout(objSide);
			$(this).show(10);
		}, function() {
			$(this).hide();
		});
	}).mouseleave(function() {
		objSide = setTimeout(function() {
			$('#sidebar').hide();
		}, 500);
	});
	//�����˵�
	$('.sidelist').mousemove(function() {
		$(this).find('h3').removeClass('border_line');

		$(this).prev().find('h3').addClass('border_line_prev');
		$(this).find('h3').addClass('hover');
		$(this).find('.i-list').show();
	});
	$('.sidelist').mouseleave(function() {
		$(this).prev().find('h3').removeClass('border_line_prev');
		$(this).find('h3').addClass('border_line');
		$(this).find('h3').removeClass('hover');
		$(this).find('.i-list').hide();
	});
}

/**
 * ���м����
 *  @return {null}
 */
bread_nav = function(){
	if(typeof(cur_good)=="undefined"){
		cur_good = typeof(window.good_info_)=="undefined"?undefined:good_info_[0];
	}
	var str = "";
	//&gt;<a href="/{$business.sBzCode}/{$type_info.iType}-0-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml">{$type_info.sTypeName}</a>
	if(typeof(cur_good)!='undefined'){
		str+='&gt;<a href="/'+globalvar.flag+'/list/'+cur_good['iType']+'-'+cur_good['iSubType']+'-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml">'+goodTypes[cur_good['iType']]['sTypeName']+'</a>';
		if(typeof(goodSubType[cur_good['iType']])!="undefined"&&typeof(goodSubType[cur_good['iType']][cur_good['iSubType']])!="undefined"){
			str+='&gt;<a href="/'+globalvar.flag+'/list/'+cur_good['iType']+'-'+cur_good['iSubType']+'-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml">'+goodSubType[cur_good['iType']][cur_good['iSubType']]['sSubTypeName']+'</a>';
		}
		str+='&gt;<a href="#">'+cur_good['sGoodsName']+'</a>';
	}else{
		if(url_info['iType']!="0"){
			str+='&gt;<a href="/'+globalvar.flag+'/list/'+url_info['iType']+'-'+url_info['iSubType']+'-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml">'+goodTypes[url_info['iType']]['sTypeName']+'</a>';
			if(typeof(goodSubType[url_info['iType']])!='undefined'){
				if(typeof(goodSubType[url_info['iType']][url_info.iSubType])!="undefined"){
					str+='&gt;<a href="/'+globalvar.flag+'/list/'+url_info['iType']+'-'+url_info['iSubType']+'-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml">'+goodSubType[url_info.iType][url_info.iSubType]['sSubTypeName']+'</a>';
				}
			}
		}
	}
	$(".location_box").append(str);
}
/**
 * ��ർ����
 *  @return {null}
 */
makeGoodNav = function(callback){
	if(typeof(cur_good)=="undefined"){
		cur_good = typeof(window.good_info_)=="undefined"?undefined:good_info_[0];
	}
	var str = "";
	var iType = "";
	if(typeof(url_info)!="undefined"){
		var arr_types = url_info['iType']!='0'?allTypes[parseInt(url_info['iType'])]:allTypes;
		iType = url_info['iType'];
	}else if(typeof(cur_good)!="undefined"){
		var arr_types = cur_good['iType']!='0'?allTypes[parseInt(cur_good['iType'])]:allTypes;
		iType = cur_good['iType'];
	}else{
		arr_types = allTypes;
		iType = "0";
	}
	if(globalvar.flag == 'lol'){
		var adtag = {
			'1': '?ADTAG=innercop.lol.SY.champion',
			'2': '?ADTAG=innercop.lol.SY.skin',
			'3': '?ADTAG=innercop.lol.SY.dj',
			'8': '?ADTAG=innercop.lol.SY.sw'
		}
	}else{
		var adtag = {};
	}
	if(iType!='0'){
		arr_types = [arr_types];
		$.each(arr_types,function(k,sidebar){
			str+='<div class="menu_sub_box"  id="menu_sub_'+sidebar.iType+'" style="'+((sidebar.subtypes.length<=0)&&'padding-bottom:0px;')+'">\
				<h3 class="title"><a href="/'+globalvar.flag+'/list/'+sidebar.iType+'-0-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml'+(adtag[sidebar.iType] ? adtag[sidebar.iType] : '')+'" style="color:#505050;">'+sidebar.sTypeName+'('+sidebar.count+')</a></h3>\
				<ul>';
			$.each(sidebar.subtypes,function(k_t,st){
				if(st.count>0){
					str+='<li><a href="/'+globalvar.flag+'/list/'+sidebar.iType+'-'+st.iSubType+'-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml'+(adtag[sidebar.iType] ? adtag[sidebar.iType] : '')+'" >'+st.sSubTypeName+'('+st.count+')</a></li>';
				}
			});
			str+='</ul></div>';
		});
	}else{
		str+='<div class="menu_sub_box"  id="menu_sub_all">\
			<h3 class="title"><a href="/'+globalvar.flag+'/list/shoppinglist.shtml" style="color:#505050;">��Ʒ�б�</a></h3>\
			<ul>';
		$.each(arr_types,function(k,sidebar){
			if(sidebar.count>0){
				str+='<li><a href="/'+globalvar.flag+'/list/'+sidebar.iType+'-0-0-0-0-0-0-0-0-0-0-00-0-0-1-1.shtml'+(adtag[sidebar.iType] ? adtag[sidebar.iType] : '')+'" >'+sidebar.sTypeName+'('+sidebar.count+')</a></li>';
			}
		});
		str+='</ul></div>';
	}

	$("#good_left_nav").hide().append(str).slideDown(600,function(){
		if($.isFunction(callback)){
			callback();
		}
	});
}

/**
 * js�������ϱ�
 *  @return {null}
 */
var report = function(page_flag){
	var s = []
	for(var i=0;i<timePoints.length;i++)
		if(!!timePoints[i])
			s.push((i+1)+"="+(timePoints[i]-d0));
	var url = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7718&flag2=86&flag3="+page_flag+"&"+s.join("&");
	if(Math.random()<0.1){
		imgSendTimePoint=new Image();
		imgSendTimePoint.src=url;
	}
}
/**
 * js�������ϱ�
 *  @return {null}
 */
var getBuyAward = function(){
	var cur_time = $.getServerTime();
	var cur_total_price = MT.getTotalPrice();
	var active_info = [];
	if(typeof(JSON_awards)!="undefined"){
		$.each(JSON_awards,function(key,item){
			var _str_tmp = "";
			var _begin_time = $.strtotime(item['begin_time']);
			var _end_time = $.strtotime(item['end_time']);
			if(cur_time>=_begin_time&&cur_time<=_end_time){
				$.each(item.conditions,function(k,v){
					var _lower = v.lower_limit;
					var _upper = v.upper_limit;
					if(cur_total_price<=_upper&&cur_total_price>=_lower){
						_str_tmp += "������"+(_lower/100)+"QB����";
						var _tmp_gift = [];
						$.each(v.present_detail,function(i,n){
							_tmp_gift.push(n['sGoodsName']+"*"+n['iQuantity']+"������ֵ"+(n['iPrice']/100)+"QB");
						});
						_str_tmp+=_tmp_gift.join(",");
					}
				})
			}
			if(_str_tmp)active_info.push({"order_award":_str_tmp});
		});
	}
	return active_info;
}

/**
 * ��¼��֤
 *  @return {null}
 */
var checkLogin = function(){
	//�����¼���
	var com_check = function(option){
		LoginManager.checkLogin(function () {
			$E("#login_qq_span").innerHTML = LoginManager.getUserUin();
			MT.getLoginInfo(function(){
				$(".gwc_num").html(MT.getCartNum());
				$("#gwd_num").html(JSON_show_login.ticket||0);
				$(".gwd_num").html(JSON_show_login.ticket||0);
				if(JSON_show_login.ticket <= 0){
					MT['cart_discount']['use_ticket'] = false;
					MT.showCartDiscountBlock();
				}
			},option);
		});
	}
	//���ﳵ��¼���
	var cart_check = function(){
		LoginManager.checkLogin(function() {
			//login do
			$E("#login_qq_span").innerHTML = LoginManager.getUserUin();
			//��ȡ�û���ʼ������
			MT.getLoginInfo(function(){
				//���¹��ﳵ����
				$(".gwc_num").html(MT.getCartNum());
				$("#gwd_num").html(JSON_show_login.ticket||0);
				$(".gwd_num").html(JSON_show_login.ticket||0);
				if(JSON_show_login.ticket <= 0){
					MT['cart_discount']['use_ticket'] = false;
					MT.showCartDiscountBlock();
				}
				//��������
				areaSetting();
				//��ʼ�����ﳵ
				initCart(function(){
					//�Ż�ȯ��ѯ
					getYhq();
				});

				//��ɫ
				/*
				 if(globalvar.flag=='dnf'){
				 $("#iZone").change(function(){
				 var val = $(this).val();
				 if(val!=""){
				 MT.getDQNum(val,0,function(){
				 $('#pay_type .loading').hide();
				 $('#help_area').html('<div class="help_ticket">'+
				 '<span>ʣ���ȯ:<span class="font_red" name="left_dq_num">'+(typeof(MT[MT.global.flag + "_dqno"])=="undefined"?"��ѡ������":MT[MT.global.flag + "_dqno"])+'</span>(1��ȯ=0.01Q��)</span>'+
				 '<label><a class="font_red" target="_blank" href="http://pay.qq.com/paygame/'+globalvar.flag+'/index.shtml">��ȯ��ֵ</a></label>'+
				 '</div>');
				 UserDq();
				 });
				 }
				 });
				 }
				 */
			},{vip:1,ticket:1});
		},function(){
			LoginManager.login();
		});
	};
	//�µ����
	var pay_check = function(){
		LoginManager.checkLogin(function() {
			//login do
			$E("#login_qq_span").innerHTML = LoginManager.getUserUin();
			//��ȡ�û���ʼ������
			MT.getLoginInfo(function(){
				//���¹��ﳵ����
				$(".gwc_num").html(MT.getCartNum());
				$params = location.href.toQueryParams();
				if($params['serialNo']){
					//��ʼ������
					initOrder($params['serialNo']);
				}else{
					new Boxy('<span>�Ƿ���������</span>',{title:"��ܰ��ʾ",closeable:false,modal:true});
				}
			},{vip:1,ticket:1});
		},function(){
			LoginManager.login();
		});
	}
	//��¼���
	var url = location.href.toString();
	var url_part = url.split("/");
	if(url.indexOf("/cart.shtml")!=-1||url.indexOf("/buy.shtml")!=-1||url.indexOf("/buy2.shtml")!=-1){
		cart_check();
	}else if(url.indexOf("/index.shtml")!="-1"||url_part.pop()==""){
		com_check({ticket:1});
	}else if(url.indexOf("/pay.shtml")!=-1){
		pay_check();
	}else{
		com_check();
	}
}
/**
 *  �û�����
 *  @return {null}
 */
var feedback = function(){
	document.write(unescape("%3Cscript src='/market/common/js/bug.js' type='text/javascript'%3E%3C/script%3E"));
	setTimeout(function(){
		if(typeof(bugMain) == 'function' && typeof(LoginManager) != 'undefined'){
			bugMain({delay:1000,iActId:globalvar.feedbackId,sGameName:'market'});
		}
	},500);
}
/**
 *  tcss analize
 *  @return {null}
 */
var tcssPing = function(adtag)
{
	//http://pingjs.qq.com/ping_tcss_ied.js
	var pgv = function(){
		if(adtag){
			pgvSendClick({hottag:adtag});
			return;
		}
		var search = location.search;
		var url = location.href;
		if(search!="")
		{
			var params = search.toQueryParams();
			var uri = url.split("?");
			var parts = location.pathname.split(".");
			var pop = parts.length>1?parts.pop():"shtml";
			var _params = "_";
			$.each(params,function(k,v){
				_params +=$.trim(k)+"_"+$.trim(v);
			});
			var new_url = parts.join(".")+_params+"."+pop;
			//pgvMain({virtualURL: new_url});
			pgvMain({virtualURL: new_url,reserved2:globalvar.flag})
		}
		else
		{
			pgvMain({reserved2:globalvar.flag});
		}
	}
	if(typeof(pgvMain) != 'function'){
		$.getScript("http://pingjs.qq.com/tcss.ping.js",pgv);
	}else{
		pgv();
	}
}
var showOpenFastBank = function(){
	var p_uin = $.cookie("uin");
	var skey = $.cookie("skey");
	var open_url = "http://daoju.qq.com/bank_ydt.shtml?flag="+globalvar.flag;
	var tenpay_login = "https://www.tenpay.com/app/v1.0/communitylogin.cgi?p_uin="+p_uin+"&skey="+skey+"&u1="+open_url+"&appid=118&win=self";
	window.fastBank_boxy = new Boxy("<iframe src="+tenpay_login+" marginwidth=0 marginheight=0 frameborder=0 width=530px style='border:#ffffff' height=460px></iframe>",{title:"��ͨ���֧��",closeText:"",modal:true});
};
/**
 * ���õ����С
 */
var setBoxySize = function(type){
	if(type=="tenpayquick"||type=="fastbank"){
		window.buy_box&&window.buy_box.resize(800,450);
	}
};
var showTips = function(data){
	$.getScript('http://ossweb-img.qq.com/images/clientpop/js/djtips.js');
	/*
	 data = {
	 title:"���»",
	 v:11,//�µ�tips��Ҫ���ֶ���1�����°汾
	 image:"http://daoju.qq.com/market/common/v_2_1/images/popup_speed.png",
	 content:'<a target="_blank" href="http://daoju.qq.com/act/speed/a20141119gej/">Ũ��ж���<br><span style="font-size:14px;">�����Ż�ȯ�����ͣ�</span></a><br><span>��ʱ��11.21-11.30</span>',
	 btnLink:"http://daoju.qq.com/act/speed/a20141119gej/"
	 };
	 var _tpl = '<div class="lbbox" id="lbbox" style="bottom:-202px;z-index:6501;">\
	 <a href="javascript:void(0)" id="gbbtn" class="gbbtn" title="�ر�">�ر�</a>\
	 <div class="box1" id="box1">\
	 <div class="lhead">\
	 <p class="hot">hot</p>\
	 <h2>'+data.title+'</h2>\
	 <a href="javascript:void(0)" id="jian" class="jianbtn">&nbsp;&nbsp;</a>\
	 </div>\
	 <div class="webox">\
	 <a target="_blank" href="'+data.btnLink+'"><img src="'+data.image+'" width="101" height="101"></a>\
	 <p>'+data.content+'</p>\
	 </div>\
	 <a target="_blank" href="'+data.btnLink+'" class="ljbtn" title="�����μ�">�����μ�</a>\
	 </div>\
	 </div>';
	 if(!$.cookie("tips"+data.v)){
	 $("body").append(_tpl);
	 $("#gbbtn").unbind("click").bind("click",function(){
	 $("#lbbox").animate({"bottom":"-202px"},500,function(){
	 $(this).hide().remove();
	 $.cookie("tips"+data.v,"1")
	 });
	 });
	 $("#jian").die("click").live("click",function(){
	 var _class = $(this).attr("class");
	 if(_class=="jianbtn"){
	 $(this).removeClass("jianbtn").addClass("jiabtn");
	 $("#lbbox").animate({"bottom":"-176px"},500);
	 $.cookie("tips_status",1);
	 }else{
	 $(this).removeClass("jiabtn").addClass("jianbtn");
	 $("#lbbox").animate({"bottom":"0px"},500);
	 $.cookie("tips_status",0);
	 }
	 });
	 if($.cookie("tips_status")==1){
	 $("#jian").removeClass("jianbtn").addClass("jiabtn");
	 $("#lbbox").css({"bottom":"-176px"});
	 }else{
	 $("#lbbox").animate({"bottom":"0px"},500);
	 }
	 }
	 */
}

/*  |xGv00|4d2f26d9480a50df31f6273712bc8521 */