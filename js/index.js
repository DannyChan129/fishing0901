/*window.onload = function(){
	hengshuping();
}*/
;(function (desw) {
    var winW =document.documentElement.clientWidth;
    radio = winW/desw;
    document.documentElement.style.fontSize = radio*100+'px';
})(750);
//屏幕方向监测
function hengshuping(){
	if(window.orientation==180||window.orientation==0){
		// alert("please hengping");
	}
	if(window.orientation==90||window.orientation==-90){
		// alert("hengping");
	}
}
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
var v_h = null,
	direction = 1,
	e,e1,e2,
	pageno = 0,
	out,
	newM = null;
var isok = true;
function init_pageH(){
	var fn_h = function(){
		if(document.compatMode == "BackCompat")
			var Node = document.body;
		else
			var Node = document.documentElement;
		return Math.max(Node.scrollHeight,Node.clientHeight);
	}
	var page_h = fn_h();
	var m_h = $(".m-page").height();
	page_h <= m_h ? v_h = page_h : v_h = m_h;
	$(".m-page").height(v_h);
	$(".p-index").height(v_h);
}
init_pageH();

//audio
var audio1 = document.getElementById("audio1");
function audioPlay(){
    var currentTime=Date.now();
    var protectTime=100;
    if((currentTime-lastRunTime)<protectTime){
        return;
    }
    if(playStatus){
        audio1.pause();
    }else{
        audio1.play();
    }
    playStatus=!playStatus;
    lastRunTime=Date.now();
}
var bgm = document.getElementById("bgm");
function bgmPlay(){
	bgm.play();
}
function bgmPause(){
	bgm.pause();
}


/*///////*/
var getFlag=function (id) {
    return document.getElementById(id);   //获取元素引用
}
var extend=function(des, src) {
    for (p in src) {
        des[p]=src[p];
    }
    return des;
}
var clss=['button1','button2','button3','button4','button5'];
var Ball=function (diameter,classn) {
    var ball=document.createElement("div");
    ball.className=classn;
    with(ball.style) {
        width=height=diameter+'px';position='absolute';
    }
    return ball;
}
var Screen=function (cid,config,w) {
    //先创建类的属性
    var self=this;
    if (!(self instanceof Screen)) {
        return new Screen(cid,config,w)
    }
    config=extend(Screen.Config, config,w)    //configj是extend类的实例    self.container=getFlag(cid);            //窗口对象
    self.container=getFlag(cid);
    self.ballsnum=config.ballsnum;
    self.diameter=100;                       //球的直径
    self.radius=self.diameter/2;
    self.spring=config.spring;              //球相碰后的反弹力
    self.bounce=config.bounce;              //球碰到窗口边界后的反弹力
    self.gravity=config.gravity;            //球的重力
    self.balls=[];                          //把创建的球置于该数组变量
    self.timer=null;                       //调用函数产生的时间id
    self.L_bound=0;                       //container的边界
    self.R_bound=document.documentElement.clientWidth || document.body.clientWidth
    self.T_bound=0;
    self.B_bound= w||document.documentElement.clientHeight || document.body.clientHeight
};
Screen.Config={                         //为属性赋初值
    ballsnum:5,
    spring:0.8,
    bounce:-0.9,
    gravity:0.04
};
Screen.prototype={
    initialize:function () {
        var self=this;
        self.createBalls();
        self.timer=setInterval(function (){self.hitBalls()}, 30)
    },
    createBalls:function () {
        var self=this,
            num=self.ballsnum;
        var frag=document.createDocumentFragment();    //创建文档碎片，避免多次刷新
        for (i=0;i<num;i++) {
            var ball=new Ball(self.diameter,clss[i]);
            //var ball=new Ball(self.diameter,clss[ Math.floor(Math.random()* num )]);//这里是随机的10个小球的碰撞效果
            ball.diameter=self.diameter;
            ball.radius=self.radius;
            ball.style.left=(Math.random()*self.R_bound)+'px';  //球的初始位置，
            ball.style.top=(Math.random()*self.B_bound)+'px';
            ball.vx=Math.random() * 6 -3;
            ball.vy=Math.random() * 6 -3;
            frag.appendChild(ball);
            self.balls[i]=ball;
        }
        self.container.appendChild(frag);
    },
    hitBalls:function () {
        var self=this,
            num=self.ballsnum,
            balls=self.balls;
        for (i=0;i<num-1;i++) {
            var ball1=self.balls[i];
            ball1.x=ball1.offsetLeft+ball1.radius;      //小球圆心坐标
            ball1.y=ball1.offsetTop+ball1.radius;
            for (j=i+1;j<num;j++) {
                var ball2=self.balls[j];
                ball2.x=ball2.offsetLeft+ball2.radius;
                ball2.y=ball2.offsetTop+ball2.radius;
                dx=ball2.x-ball1.x;                      //两小球圆心距对应的两条直角边
                dy=ball2.y-ball1.y;
                var dist=Math.sqrt(dx*dx + dy*dy);       //两直角边求圆心距
                var misDist=ball1.radius+ball2.radius;   //圆心距最小值
                if(dist < misDist) {
                    //假设碰撞后球会按原方向继续做一定的运动，将其定义为运动A
                    var angle=Math.atan2(dy,dx);
                    //当刚好相碰，即dist=misDist时，tx=ballb.x, ty=ballb.y
                    tx=ball1.x+Math.cos(angle) * misDist;
                    ty=ball1.y+Math.sin(angle) * misDist;
                    //产生运动A后，tx > ballb.x, ty > ballb.y,所以用ax、ay记录的是运动A的值
                    ax=(tx-ball2.x) * self.spring;
                    ay=(ty-ball2.y) * self.spring;
                    //一个球减去ax、ay，另一个加上它，则实现反弹
                    ball1.vx-=ax;
                    ball1.vy-=ay;
                    ball2.vx+=ax;
                    ball2.vy+=ay;
                }
            }
        }
        for (i=0;i<num;i++) {
            self.moveBalls(balls[i]);
        }
    },
    moveBalls:function (ball) {
        var self=this;
        ball.vy+=self.gravity;
        ball.style.left=(ball.offsetLeft+ball.vx)+'px';
        ball.style.top=(ball.offsetTop+ball.vy)+'px';
        //判断球与窗口边界相碰，把变量名简化一下
        var L=self.L_bound, R=self.R_bound, T=self.T_bound, B=self.B_bound, BC=self.bounce;
        if (ball.offsetLeft < L) {
            ball.style.left=L;
            ball.vx*=BC;
        }
        else if (ball.offsetLeft + ball.diameter > R) {
            ball.style.left=(R-ball.diameter)+'px';
            ball.vx*=BC;
        }
        else if (ball.offsetTop < T) {
            ball.style.top=T;
            ball.vy*=BC;
        }
        if (ball.offsetTop + ball.diameter > B) {
            ball.style.top=(B-ball.diameter)+'px';
            ball.vy*=BC;
        }
    }
}
window.onload=function() {
    var sc=null;
    document.getElementById("inner").innerHTML='';
    sc=new Screen('inner',{ballsnum:5, spring:0.3, bounce:-0.9, gravity:0.01});
    sc.initialize();
}


/*////////*/
$(".startbut").bind("click",function(){
	$(".start").hide();
	$("#bgm").attr("src","audio/bg.mp3");
		bgm.play();
	$(".rule").show();
});
	$(".rule p").bind("click", function() {
			$(".rule").hide();
			$(".part1").show();
			part1();
	});


function part1() {
   $('.dialogue1').show().addClass('text_animation');
   setTimeout(function () {
       $("#audio1").attr("src","audio/a1.mp3");
       audio1.play();
   },1000)
    $('.dialogue1').bind('click',function () {
        $("#audio1").attr("src","audio/a1.mp3");
        audio1.play();
    })
    var sc1 = null;
    var w = 300;
    document.getElementById("part1bubble").innerHTML='';
    sc1=new Screen('part1bubble',{ballsnum:5, spring:0.3, bounce:-0.9, gravity:0.01},w);
    sc1.initialize();
    setTimeout(function () {
        $('.button5').bind('click',function () {
          $('#part1bubble div').unbind();
            $('.button5').css("background","url(images/bubble1_break.png) top center no-repeat")
            $('.button5').css("background-size","100% 100%")
            clearInterval(sc1.timer);
            $("#audio1").attr("src","audio/bubble.mp3");
            audio1.play();
            setTimeout(function () {
                $('.mack1').show();
                $('.next1').show();
                $('.next1').bind('click',function () {
					$('.part1').hide();
					$('.part2').show();
					part2();
                })
            },1500)

        })
        $('.button2').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
            $('.mack').show();
        })
        $('.button3').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
        $('.button4').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
        $('.button1').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
    },4000)
}

/*part2*/
function part2() {
    $('.dialogue2').show().addClass('text_animation');
    setTimeout(function () {
        $("#audio1").attr("src","audio/a2.mp3");
        audio1.play();
    },1000)
    $('.dialogue2').bind('click',function () {
        $("#audio1").attr("src","audio/a2.mp3");
        audio1.play();
    })
    var sc1 = null;
    var w = 300;
    document.getElementById("part1bubble").innerHTML='';
    sc1=new Screen('part2bubble',{ballsnum:4, spring:0.3, bounce:-0.9, gravity:0.01},w);
    sc1.initialize();
    setTimeout(function () {
        $('.button4').bind('click',function () {
            $('#part2bubble div').unbind();
            $('.button4').css("background","url(images/bubble2_break.png) top center no-repeat")
            $('.button4').css("background-size","100% 100%")
            clearInterval(sc1.timer);
            $("#audio1").attr("src","audio/bubble.mp3");
            audio1.play();
            setTimeout(function () {
                $('.mack2').show();
                $('.next2').show();
                $('.next2').bind('click',function () {
                    $('.part2').hide();
                    $('.part3').show();
                    part3();
                })
            },1500)

        })

        $('.button1').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
        $('.button2').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
        $('.button3').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
    },4000)
}

function part3() {
    $('.dialogue3').show().addClass('text_animation');
    setTimeout(function () {
        $("#audio1").attr("src","audio/a3.mp3");
        audio1.play();
    },1000)
    $('.dialogue3').bind('click',function () {
        $("#audio1").attr("src","audio/a3.mp3");
        audio1.play();
    })
    var sc1 = null;
    var w = 300;
    document.getElementById("part1bubble").innerHTML='';
    sc1=new Screen('part3bubble',{ballsnum:3, spring:0.3, bounce:-0.9, gravity:0.01},w);
    sc1.initialize();
    setTimeout(function () {
        $('.button3').bind('click',function () {
            $('#part3bubble div').unbind();
            $('.button3').css("background","url(images/bubble3_break.png) top center no-repeat")
            $('.button3').css("background-size","100% 100%")
            clearInterval(sc1.timer);
            $("#audio1").attr("src","audio/bubble.mp3");
            audio1.play();
            setTimeout(function () {
                $('.mack3').show();
                $('.next3').show();
                $('.next3').bind('click',function () {
                    $('.part3').hide();
                    $('.part4').show();
                    part4();
                })
            },1500)

        })

        $('.button1').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
        $('.button2').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
    },4000)
}

/*part4*/
function part4() {
    $('.dialogue4').show().addClass('text_animation');
    setTimeout(function () {
        $("#audio1").attr("src","audio/a4.mp3");
        audio1.play();
    },1000)
    $('.dialogue4').bind('click',function () {
        $("#audio1").attr("src","audio/a4.mp3");
        audio1.play();
    })
    var sc1 = null;
    var w = 300;
    document.getElementById("part1bubble").innerHTML='';
    sc1=new Screen('part4bubble',{ballsnum:2, spring:0.3, bounce:-0.9, gravity:0.01},w);
    sc1.initialize();
    setTimeout(function () {
        $('.button2').bind('click',function () {
            $('#part4bubble div').unbind();
            $('.button2').css("background","url(images/bubble4_break.png) top center no-repeat")
            $('.button2').css("background-size","100% 100%")
            clearInterval(sc1.timer);
            $("#audio1").attr("src","audio/bubble.mp3");
            audio1.play();
            setTimeout(function () {
                $('.mack4').show();
                $('.next4').show();
                $('.next4').bind('click',function () {
                    $('.part4').hide();
                    $('.part5').show();
                    part5();
                })
            },1500)

        })
        $('.button1').bind('click',function () {
            $("#audio1").attr("src","http://live.babyfs.cn/web/H5/common/audio/wrong3.mp3");
            audio1.play();
        })
    },4000)
}

/*part5*/
function part5() {
    $('.dialogue5').show().addClass('text_animation');
    setTimeout(function () {
        $("#audio1").attr("src","audio/a5.mp3");
        audio1.play();
    },1000)
    $('.dialogue5').bind('click',function () {
        $("#audio1").attr("src","audio/a5.mp3");
        audio1.play();
    })
    var sc1 = null;
    var w = 300;
    document.getElementById("part1bubble").innerHTML='';
    sc1=new Screen('part5bubble',{ballsnum:1, spring:0.3, bounce:-0.9, gravity:0.01},w);
    sc1.initialize();
    setTimeout(function () {
        $('.button1').bind('click',function () {
            $('#part5bubble div').unbind();
            $('.button1').css("background","url(images/bubble5_break.png) top center no-repeat")
            $('.button1').css("background-size","100% 100%")
            clearInterval(sc1.timer);
            $("#audio1").attr("src","audio/bubble.mp3");
            audio1.play();
            setTimeout(function () {
                $('.mack5').show();
                $('.next5').show();
                $('.next5').bind('click',function () {
                    $('.part5').hide();
                    $('.part6').show();
                    part6();
                })
            },1500)
        })
    },4000)
}
/*part6*/
function part6() {
	$('.part6 .fish').show();
    $('.next6').show();
    $('.next6').bind('click',function () {
        $('.part6').hide();
        $('.end').show();
    })
}

//end

//再来一次
$(".playangin").click(function(){
	window.location.href=window.location.href+"?id="+10000*Math.random();
});
//预加载
var num = 0;
var the_images = [
    "images/again.png",
    "images/bubble4_break.png",
    "images/jimmy.png",
    "images/mack.png",
    "images/text1.png",
    "images/btn_go.png",
    "images/bubble5.png",
    "images/jimmy_yugan1.png",
    "images/mack2.png",
    "images/text2.png",
    "images/btn_next.png",
    "images/bubble5_break.png",
    "images/jimmy_yugan2.png",
    "images/page1.jpg",
    "images/text3.png",
    "images/bubble1.png",
    "images/diaoyu.png",
    "images/jimmy_yugan3.png",
    "images/page2.jpg",
    "images/text4.png",
    "images/bubble1_break.png",
    "images/end_bg.png",
    "images/jimmy_yugan4.png",
    "images/page3.jpg",
    "images/text5.png",
    "images/bubble2.png",
    "images/end_img2.png",
    "images/jimmy1.png",
    "images/page4.jpg",
    "images/title.png",
    "images/bubble2_break.png",
    "images/fish.png",
    "images/lastPage.jpg",
    "images/page5.jpg",
    "images/yuer.png",
    "images/bubble3.png",
    "images/fish1.png",
    "images/layu.png",
    "images/page5.png",
    "images/yugou.png",
    "images/bubble3_break.png",
    "images/hint_hand.png",
    "images/loading.gif",
    "images/rule.jpg",
    "images/bubble4.png",
    "images/homePage.jpg",
    "images/logo_babyfs.png",
    "images/starbut.png",
    "audio/a1.mp3",
    "audio/a2.mp3",
    "audio/a3.mp3",
    "audio/a4.mp3",
    "audio/a5.mp3",
    "audio/bg.mp3",
    "audio/bubble.mp3",

];
jQuery.imgpreload(the_images,{
	each: function(){
		var status = $(this).data('loaded')?'success':'error';
		if(status=="success"){
			++num;
			$("#lodingnum").html((num/the_images.length*100).toFixed(0)+"%");
		}
	},
	all: function(){
		$("#lodingnum").html("100%");
		setTimeout(function(){
			document.getElementById('loading').style.display = "none";
			$(".p-index").css("display","block");
			setTimeout(function(){
				$(".test1").addClass("test1-animate");
			},1500)
		}, 300)
	}
})