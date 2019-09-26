# Carouse
使用原生JS实现轮播图的组件化

<h3>目录：</h3>

- [重点步骤](#2)
     - [轮播](#2-1)
     - [自动轮播](#2-2)
     - [无缝滑动](#2-3)
     - [点击小圆点切换](#2-4)
     - [鼠标事件-自动轮播停止或继续](#2-5)
- [具体代码](#3)
- [多图单张轮播](#4)
- [多图多张轮播](#5)


<h3 id="2">重点步骤</h3>

<h4 id="2-1">轮播</h4> 

简单轮播图的设计思想是设置一个大的区域，比如div，将需要轮播的图片依次排列在这个div中，并且设置这个div的宽度为一张图片的宽度，并且设置overflow：hidden，隐藏掉其他的图片。
```
#container {
	margin: 0 auto;
	max-width: 1000px;
	height: 500px;
	overflow: hidden;
	position: relative;
}

```

图片区域通过绝对定位放在大div的合适位置，滑动的实现是通过改变图片区域的位置，这里面是用了left的滑动。
```
#images {
	border: 0;
	left: -1005px;
	top: 0;
	width: 7030px;
	height: 500px;
	position: absolute;
	z-index: 1;
	list-style: none;
	transition-property: all;
	transition-duration: 0.5s;
}
```
向左向右的轮播只需改变left的值即可。

<h4 id="2-2">自动轮播</h4> 
自动轮播的实现比较简单，只需设置一个定时器来执行向右滑动的按钮即可。

```
// 定时器
function play() {
	timer = setInterval(function() {
		rightMove();
	}, 2000);
}
play();

```

<h4 id="2-3"> 无缝滑动</h4>
向左向右滑动时，如果要从一头滑到另一头，会有一个切换好多张的动画效果，我们想和切换一张的效果一样，就需要在头和尾各多加一张图片。

图片顺序为：5 -> 1 -> 2 -> 3 -> 4 -> 5 -> 1
当快要移动到最后一张的时候，设置一个延时执行的函数，
在它播放动画移动到最后一张的过渡效果完成之后，偷偷地迅速地换到第二张，并且设置不显示过渡动画。
这样视觉上感觉两个1是一样的，达到了无缝过渡的效果。
在偷偷移动之后，再将过渡动画效果设置回来。
另一边也同理。
```
if (newLeft < (-(widthPx) * (imageNum-2))) {
	setTimeout(function() {
	    images.style.transitionProperty = "none";
	    images.style.transitionDuration = "0s";
	    images.style.left = -(widthPx) + 'px';
	    newLeft = -(widthPx);
	}, 500);
	images.style.transitionProperty = "all";
	images.style.transitionDuration = "0.5s";
}else {
	images.style.transitionProperty = "all";
	images.style.transitionDuration = "0.5s";
}
			
images.style.left = newLeft + 'px';
console.log("图片右滑 rightMove newLeft: " + newLeft);
moveOn("right");
```



<h4 id="2-4"> 点击小圆点切换</h4>
需要设置一个绝对定位的区域，其中的小圆点要设置一个样式（圆点背景颜色），每次切换时样式需改变。为圆点设置一个index属性，用来区分每个小圆点的顺序。
同时，每个小圆点都是可点击的，当点击的时候，获取小圆点的顺序，然后计算该切到哪一张图。
再把当前的小圆点背景颜色清除，设置下一个有背景颜色。

```
// 为小圆点添加点击切换图片事件
for (var i = 0; i < points.length; i++) {
	points[i].addEventListener("click", function() {
		var clickIndex = parseInt(this.getAttribute('index'));
		newLeft = (clickIndex+1) * -(widthPx);
		document.getElementById("images").style.left = newLeft + 'px';
		//清除原来的样式,并为新的添加
		for(var i=0; i<points.length; i++) {
			if(points[i].className == "on") {
				points[i].className = "";
			}
		}
		points[clickIndex].className = "on";
	});
}
```

<h4 id="2-5"> 鼠标事件-自动轮播停止或继续</h4>

```
container.onmouseover = stop;
container.onmouseout = play;
```


<h3 id="4">多图单张轮播</h3>

跟单张显示轮播图类似，只需要改一下窗口的大小、图片的大小和边界的判断条件即可。
本例使用6张轮播图，每次显示3张，每次滑动1张。窗口大小为三张图片的宽度。

当窗口滑动到612时，需要设置延时，在它过渡到后面的123之后，使其快速地回到前面的123，然后继续向234滑动，达到无缝滑动的效果。
代码：
```
if (newLeft < (-(widthPx) * (imageNum-4))) {
	setTimeout(function() {
		images.style.transitionProperty = "none";
		images.style.transitionDuration = "0s";
		images.style.left = 0 + 'px';
		newLeft = 0;
	}, 500);
	images.style.transitionProperty = "all";
	images.style.transitionDuration = "0.5s";
}else {
	images.style.transitionProperty = "all";
	images.style.transitionDuration = "0.5s";
}
```

<h3 id="4">多图多张轮播</h3>

跟多图单张轮播图类似，只需要改变每次滑动的大小和边界的判断条件即可。
本例使用6张轮播图，每次显示3张，每次滑动1张。窗口大小为三张图片的宽度。

当窗口滑动到456时，需要设置延时，在它过渡到后面的123之后，使其快速地回到前面的123，然后继续向456滑动，达到无缝滑动的效果。

```
if (newLeft <= (-(widthPx) * (imageNum-7))) {
	setTimeout(function() {
		images.style.transitionProperty = "none";
		images.style.transitionDuration = "0s";
		images.style.left = 0 + 'px';
		newLeft = 0;
        }, 500);
	images.style.transitionProperty = "all";
	images.style.transitionDuration = "0.5s";
}else {
	images.style.transitionProperty = "all";
	images.style.transitionDuration = "0.5s";
}
```
