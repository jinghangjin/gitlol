/*
 * 前端页面启动程序
 * SVN: $Id: dj_run.js 27994 2013-12-12 03:13:10Z lantezhang $
 */
$(document).ready(function() {
	checkLogin();
	
	initMember();
	initXinyue();
	initJudou();
	//道具搜索
	setHeaderSearch();
	//全部分类下拉
	makeSidebar();
	//腾讯游戏下拉
	//initGameArea();
	//弹层
	showTips();
	//tcss
	tcssPing();
	/*var para=location.search.toQueryParams();
	if(para.status=="1"){
		$.cookie("debug",1);
	}
	if($.cookie("debug")!=1){
		location.href="http://daoju.qq.com/notice.shtml";
	}*/
});
//feedback
feedback();

/*  |xGv00|e84ab88bebce3f22ff9583925db64915 */