/**
 * 
 */
if(typeof(jQuery)=="undefined")
document.writeln("<script type=\"text/javascript\" src=\"/comm-htdocs/feedback/v1.0/jquery-1.4.4.min.js\"><\/script>");
document.writeln("<script type=\"text/javascript\" src=\"/comm-htdocs/feedback/v1.0/box.js\"><\/script>");

var defaults = {
	on_off:            'on',
	off_msg:           '系统维护中，预计18点后开放。',
	iPlatId:           0,
	iActId:			   0,
	sGameName:         'market',
	sPageTitle:		   document.title,
	sRefer:	           document.location.href,
	sTicket:           'ABCDE',
	delay:             5000,
	Callback:          function(){}
};

var g_options = {};

function FeedBack()
{
	if(typeof(LoginManager) != 'undefined'){
		/*LoginManager.checkLogin(function(){
			FeedbackBox(sPageTitle, sRefer);
		},function(){
			LoginManager.login();
		});*/
		LoginManager.submitLogin(function(){
			FeedbackBox(g_options);
		});
	}	
}

function nav_button()
{
	jQuery("head").append('<style>\
		.feedback_tips_to_feedback,.feedback_tips_to_top{\
			width:40px;	margin-right:-1px;display:block;float:left;height:35px;text-indent:-999px;overflow:hidden;cursor:pointer;background-image:url(/comm-htdocs/feedback/v1.0/images/button.png?max_age=19830211&d=0905212126);\
		}\
		.feedback_tips_to_feedback{background-position:-39px 0}\
		.feedback_tips_to_feedback:hover{text-decoration:none;background-position:-39px -35px}\
		.feedback_tips_to_top{background-position:-117px 0}\
		.feedback_tips_to_top:hover{background-position:-117px -35px}\
	</style>');
	
	jQuery("body").append('<div style="width: 100%;">\
		<div id="_feedback_layout" style="bottom: 0pt; right: 0pt; z-index: 6500; position: fixed;">\
			<div style="float:right;" id="returnTop">\
				<a href="javascript:gotoTop();" class="feedback_tips_to_top"><span class="none">顶部</span></a>\
			</div>\
			<div style="float:right;">\
				<a href="javascript:void(0);" onclick="javascript:FeedBack();" class="feedback_tips_to_feedback"><span class="none">反馈</span></a>\
			</div>\
		</div>\
	</div>');
}
function gotoTop()
{
	$("body,html").animate({"scrollTop":0},600);
}
function bugMain(options)
{
	g_options = jQuery.extend(defaults, options);  
	if(g_options.on_off!="on"){
		return;
	}else{
		setTimeout(function(){
			nav_button();
		},g_options.delay);
	}
}

function getOptions()
{
	return g_options;
}/*  |xGv00|3bb087aa4a8558476e60aa87763b877f */