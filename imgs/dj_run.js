/*
 * ǰ��ҳ����������
 * SVN: $Id: dj_run.js 27994 2013-12-12 03:13:10Z lantezhang $
 */
$(document).ready(function() {
	checkLogin();
	
	initMember();
	initXinyue();
	initJudou();
	//��������
	setHeaderSearch();
	//ȫ����������
	makeSidebar();
	//��Ѷ��Ϸ����
	//initGameArea();
	//����
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