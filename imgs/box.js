document.writeln('<div id="__maskFeedbackBoxDiv__" style="position: absolute;display: none; left:0; top:0;width: 100%;height: 100%; z-index: 900; background: #DFE0E1 ;filter: alpha(opacity=50);opacity: 0.5"></div>');
document.domain="qq.com";

function FeedbackBox(options)
{
	if(!document.getElementById("__MsgFeedbackBoxDiv__"))
	{
        var oDiv=document.createElement("div");
        oDiv.id="__MsgFeedbackBoxDiv__";
		oDiv.style.width="552px";
        oDiv.style.height="468px";        
        oDiv.style.border="0px";
        oDiv.style.padding="0px"; 
        oDiv.style.margin="0px";
        oDiv.style.position="absolute";
        oDiv.style.zIndex="998";
        oDiv.style.top="30%";
        oDiv.style.left="40%";
        //oDiv.style.visibility = "hidden";
        var oIFrame=document.createElement("iframe");
        oIFrame.id="__MsgFeedbackBoxIframe__";
		//oIFrame.src=encodeURI("/comm-htdocs/feedback/v1.0/box.htm?iActId="+options.iActId+"&sGameName="+options.sGameName+"&sPageTitle="+options.sPageTitle+"&sRefer="+options.sRefer+"&sTicket="+options.sTicket+"&_r="+Math.random());
        //用这种方式在TT下第一打开是白页面
		oIFrame.frameborder="0";
        oIFrame.scrolling="no";
        oIFrame.width="100%";
        oIFrame.height="100%";
		oIFrame.frameBorder ="0";
        oDiv.appendChild(oIFrame);
        document.body.appendChild(oDiv);
		document.getElementById("__MsgFeedbackBoxIframe__").src=encodeURI("/comm-htdocs/feedback/v1.0/box.htm?iActId="+options.iActId+"&sGameName="+options.sGameName+"&sPageTitle="+options.sPageTitle+"&sRefer="+options.sRefer+"&sTicket="+options.sTicket+"&_r="+Math.random());
		MaskDivShow();
	}
    else
	{		
		document.getElementById("__MsgFeedbackBoxDiv__").style.display="";
		document.getElementById("__MsgFeedbackBoxDiv__").style.width="552px";
		document.getElementById("__MsgFeedbackBoxDiv__").style.height="468px"; 
		document.getElementById("__MsgFeedbackBoxIframe__").src=encodeURI("/comm-htdocs/feedback/v1.0/box.htm?iActId="+options.iActId+"&sGameName="+options.sGameName+"&sPageTitle="+options.sPageTitle+"&sRefer="+options.sRefer+"&sTicket="+options.sTicket+"&_r="+Math.random());
		MaskDivShow();
    }	
	
	fb_moveHandler=function()
	{
		fb_positionByPrecent(document.getElementById("__MsgFeedbackBoxDiv__"),{left:0.5,top:0.5})
	}; 

    fb_moveHandler();
	
    if (document.addEventListener) 
	{
        window.addEventListener("scroll", fb_moveHandler, false);
        window.addEventListener("resize", fb_moveHandler, false);
    }
	else if (document.attachEvent) 
	{
        window.attachEvent('onscroll', fb_moveHandler);
        window.attachEvent('onresize', fb_moveHandler);
    }
}

function fb_getWindowSize()
{
    var minClientHeight=Math.min(document.documentElement.clientHeight,document.body.clientHeight);
    var minClientWidth=Math.min(document.documentElement.clientWidth,document.body.clientWidth);
    if(minClientHeight==0) minClientHeight=document.documentElement.clientHeight+document.body.clientHeight;
    if(minClientWidth==0) minClientWidth=document.documentElement.clientWidth+document.body.clientWidth;
    return {width:minClientWidth,height:minClientHeight}
}

function fb_getScrollOffsets() 
{
    return {
        left:window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        top:window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop}
}

function fb_positionByPrecent(event,precent) 
{
    var bodySize=fb_getWindowSize()
    var bodyScrollOff=fb_getScrollOffsets()
    event.style.top=Math.floor(bodyScrollOff.top+(bodySize.height-parseInt(event.clientHeight||event.style.height))*(precent.top||0.5))+"px";
    event.style.left=Math.floor(bodyScrollOff.left+(bodySize.width-parseInt(event.clientWidth||event.style.width))*(precent.left||0.5))+"px";  
    if(event.style.top<0) 
	{
        element.style.top="30%"
        element.style.left="30%"
    }
}

function MaskDivShow()
{
	var maskDiv = document.getElementById("__maskFeedbackBoxDiv__");
	maskDiv.style.width=document.body.scrollWidth+"px";
	maskDiv.style.height=document.body.scrollHeight+"px";
	maskDiv.style.display=""; 
}

function MaskDivClose()
{	
	document.getElementById("__maskFeedbackBoxDiv__").style.display="none";
}

function FeedbackBoxHide()
{	
	document.getElementById("__MsgFeedbackBoxDiv__").style.display="none";
}

/*function FeedbackBoxShow()
{
	MaskDivShow()
	document.getElementById("__MsgFeedbackBoxDiv__").style.display="";
}*/

function FeedbackBoxClose()
{
	MaskDivClose();
	FeedbackBoxHide();
}

function FeedbackBoxResize(width, height)
{	
	var MsgBoxDiv= document.getElementById("__MsgFeedbackBoxDiv__");
	MsgBoxDiv.style.width = width + "px";
	MsgBoxDiv.style.height = height + "px";
	MsgBoxDiv.style.visibility = "hidden";
	MsgBoxDiv.style.visibility = "visible";
}

function ReplaceAll(str, sptr, sptr1)
{
	while (str.indexOf(sptr) >= 0){
	   str = str.replace(sptr, sptr1);
	}
	return str;
}

/*  |xGv00|c665b3d35d1a4751b3e397ca2ba92e1b */