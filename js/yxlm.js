$(function(){
	        //二维码验证
			$(".pues").mouseenter(function(){
			    $(".djcode").css("display","block");
			});
			$(".pues").mouseleave(function(){
			    $(".djcode").css("display","none");
			});
			//侧边导航栏
		    $(".items_tom").mouseenter(function(){
			      $(".weak").css("display","block");
			});
			$(".weak").mouseleave(function(){
				  $(".weak").css("display","none");
			});
			$(".reat_t .uniks").on("click",function(){
		      $(".cover_sorkt").show();
			  $(".cover_sork").hide();
	        });
			 $("dl").mouseenter(function(){
			  $(this).find(".pop_tips").stop().show();
		    });
			$("dl").mouseleave(function(){
			  $(this).find(".pop_tips").stop().hide();
		    });
			$(".dense").click(function(){
				$(".boxs").css("display","block");
			});
			$(".close_b").click(function(){
				$(".boxs").css("display","none");
			});
			$(".unico_s").click(function(){
				$(".boxs").css("display","block");
			});
			/**
			  轮播
			*/
			var now = next = 1;
			//点击左按钮 让图片向下运动
			var allend = 0;
			var on = true;
			$(".cover_right")[0].onclick = function(){
			    next++;
				next %= $(".img").length;
				if(allend == $(".img").length){
				   on=true;
				   allend=0;
				}
				actives(); 
			};
			//点击右按钮 让图片向上运动
			$(".cover_left")[0].onclick = function(){
			    next--;
				if(next <= -1){
				next = $(".img").length - 1;
				}
				if(allend == $(".img").length){
				   on=true;
				   allend=0;
				}
				actives();
			};
			//鼠标移入imgs_arr_c时 清楚定时器
			 $('.imgs_arr_c')[0].onmouseenter = function(){
			    clearInterval(timer);
			 }
			 $('.imgs_arr_c')[0].onmouseleave = function(){
			    addInterval();
			 }
			addInterval();
			function addInterval(){
			    timer = setInterval(function(){
				   next++;
				   next %= $(".img").length;
				   actives();
				},5000)
			}
			function actives(){
			 animate($('.imgs_arr_c')[0],{
					'margin-top': -245*next
				},300,function(){
					if(next ==  $(".img").length - 1){
					   next = 1;
					  $('.imgs_arr_c')[0].style.marginTop = -245 * next + 'px';
					 if(next == 0){
					   next = $(".img").length-1;
					   $('.imgs_arr_c')[0].style.marginTop = -245 * next + 'px';
					 }

				  }
			//处理导航
			 removeClass($(".cirler_items")[now-1],'active');
			 addClass($(".cirler_items")[next-1],'active');
			 now = next;
			});
		}
		    //导航鼠标点击事件
			for(var i=0;i<$(".cirler_items").length;i++){
			// 保留当前下标的位置
			   $(".cirler_items")[i].index = i;
			   $(".cirler_items")[i].onmouseenter = function(){
			      next = this.index+1;
				  actives();
			   }
			}
		   //选项卡切换
		   /*$(".title01_ul li").on("mouseenter",function(){
		      $(this).addClass("items").siblings().removeClass("items");
		      var index = $(".title01_ul li").index(this);
		      $("#product_adp_0").eq(index).removeClass('style').siblings().addClass("style");
		   });
		  */
		  $(".title01_ul .items1").hover(function(){
			   $(".box_list").show();
			   $(".box_list_01").hide();
			   $(".box_list_02").hide();
			});
		  $(".title01_ul .items2").hover(function(){
			   $(".box_list").hide();
			   $(".box_list_01").show();
			   $(".box_list_02").hide();
			});
		  $(".title01_ul .items3").hover(function(){
			   $(".box_list").hide();
			   $(".box_list_01").hide();
			   $(".box_list_02").show();
			});
			//添加定时器 活动倒计时  
		  function show_time(){ 
			var time_start = new Date().getTime(); //设定当前时间
			var time_end =  new Date("2017/07/10 10:00:00").getTime(); //设定目标时间
			// 计算时间差 
			var time_distance = time_end - time_start; 
			// 天
			var int_day = Math.floor(time_distance/86400000) 
			time_distance -= int_day * 86400000; 
			// 时
			var int_hour = Math.floor(time_distance/3600000) 
			time_distance -= int_hour * 3600000; 
			// 分
			var int_minute = Math.floor(time_distance/60000) 
			time_distance -= int_minute * 60000; 
			// 秒 
			var int_second = Math.floor(time_distance/1000) 
			// 时分秒为单数时、前面加零 
			if(int_day < 10){ 
				int_day = "0" + int_day; 
			} 
			if(int_hour < 10){ 
				int_hour = "0" + int_hour; 
			} 
			if(int_minute < 10){ 
				int_minute = "0" + int_minute; 
			} 
			if(int_second < 10){
				int_second = "0" + int_second; 
			} 
			// 显示时间 
			$("#t_d1").html(int_day+"天"); 
			$("#t_h1").html(int_hour+"时"); 
			$("#t_m1").html(int_minute+"分"); 
			$("#t_s1").html(int_second+"秒");
            $("#t_d2").html(int_day+"天"); 
			$("#t_h2").html(int_hour+"时"); 
			$("#t_m2").html(int_minute+"分"); 
			$("#t_s2").html(int_second+"秒");
            $("#t_d3").html(int_day+"天"); 
			$("#t_h3").html(int_hour+"时"); 
			$("#t_m3").html(int_minute+"分"); 
			$("#t_s3").html(int_second+"秒");
            $("#t_d4").html(int_day+"天"); 
			$("#t_h4").html(int_hour+"时"); 
			$("#t_m4").html(int_minute+"分"); 
			$("#t_s4").html(int_second+"秒");			
            // 设置定时器
           setTimeout(show_time,1000); 
          }
		   show_time();
		  //热门排行 展示
		    $(".bx_top_small").mouseenter(function(){
			  $('.bx_top').find('.bx_top_big').hide();
			  $('.bx_top').find('.bx_top_small').show();
			  $(this).hide();
			  $(this).prev('.bx_top_big').eq(0).show();
            });
		  //
		  $(".dense").click(function(){
			  $(".cover_sork").css("display","block");
		  });
		  $(".dense").click(function(){
			  $(".cover_backss").css("display","block");
		  });
		  $(".close_b").click(function(){
			  $(".cover_sork").css("display","none");
		  });
		  $(".close_b").click(function(){
			  $(".cover_sorkt").css("display","none");
		  });
		  $(".ico_unico").click(function(){
			  $(".cover_sork").css("display","block");
		  });
		}
	 )