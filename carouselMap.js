var slideNum = 1;
var slidePx;
var imageListLength;
var imageWidth;
var autoSlide = true;
var displayNum = 1;
var transitionDuration = 0.5;
var intervalSeconds = 2;
var leftToRightSlide = true;
var timer = new Object();
var mouseDrag = true;
var keyBoardEvent = true;
var recycleSlide = true;


function Carousel(carousel) {

	this.imageSize = carousel.imageSize;


	if (carousel.slideNum != null && carousel.slideNum !== undefined && typeof carousel.slideNum != NaN) {
		slideNum = carousel.slideNum;
	}

	if (carousel.displayNum != null && carousel.displayNum !== undefined && typeof carousel.displayNum != NaN) {
		displayNum = carousel.displayNum;
	}

	if (carousel.intervalSeconds != null && carousel.intervalSeconds !== undefined && typeof carousel.intervalSeconds !=
		NaN) {
		intervalSeconds = carousel.intervalSeconds;
	}

	if (carousel.transitionDuration != null && carousel.transitionDuration !== undefined && typeof carousel.transitionDuration !=
		NaN) {
		transitionDuration = carousel.transitionDuration;
	}

	if (carousel.autoSlide != null && carousel.autoSlide !== undefined) {
		autoSlide = carousel.autoSlide;
	}

	if (carousel.autoSlide != null && carousel.autoSlide !== undefined) {
		autoSlide = carousel.autoSlide;
	}

	if (carousel.leftToRightSlide != null && carousel.leftToRightSlide !== undefined) {
		leftToRightSlide = carousel.leftToRightSlide;
	}

	if (carousel.mouseDrag != null && carousel.mouseDrag !== undefined) {
		mouseDrag = carousel.mouseDrag;
	}

	if (carousel.keyBoardEvent != null && carousel.keyBoardEvent !== undefined) {
		keyBoardEvent = carousel.keyBoardEvent;
	}

	if (carousel.recycleSlide != null && carousel.recycleSlide !== undefined) {
		recycleSlide = carousel.recycleSlide;
	}

	imageListLength = carousel.imagesList.length + 6;


	for (var i = 0; i < carousel.containerArray.length; i++) {

		containerArray = carousel.containerArray;
		containerIndex = i;
		console.log("-----------containerIndex::" + containerIndex);
		this.init();
		this.imagesInit(carousel);
		this.pointDivInit(carousel);
		this.buttonInit(carousel);
		this.addButtonEvent(carousel);
		this.play();

	}



	// 销毁轮播图
	this.destory = function(node) {
		console.log(typeof node);
		if (node === null || node === undefined) {
			console.log("node有误");
			return;
		}
		// 移除HTML
		node.remove();
		// 移除定时器
		clearInterval(timer[node.id]);
		delete timer[node.id];
		// 移除container

		console.log("timer长度：" + Object.getOwnPropertyNames(timer).length);
		console.log("containerArray长度：" + containerArray.length);
	}

	this.removeAllEvent = function(node) {
		if (node === null || node == "") {
			console.log("全部清除事件！！")
			let userLeftButton = document.getElementsByName("leftButton");
			let userRightButton = document.getElementsByName("rightButton");
			let userStopButton = document.getElementsByName("stopButton");
			let userRestartButton = document.getElementsByName("restartButton");
			if (userLeftButton != null && userLeftButton.length > 0) {
				for (let i = 0; i < userLeftButton.length; i++) {
					userLeftButton[i].onclick = null;
				}
			}
			if (userRightButton != null && userRightButton.length > 0) {
				for (let i = 0; i < userRightButton.length; i++) {
					userRightButton[i].onclick = null;
				}
			}
			if (userStopButton != null && userStopButton.length > 0) {
				for (let i = 0; i < userStopButton.length; i++) {
					userStopButton[i].onclick = null;
				}
			}
			if (userRestartButton != null && userRestartButton.length > 0) {
				for (let i = 0; i < userRestartButton.length; i++) {
					userRestartButton[i].onclick = null;
				}
			}

			let imagesList = document.querySelectorAll("#images");
			for (let i = 0; i < imagesList.length; i++) {
				let images = imagesList[i];
				images.onmousedown = null;
				images.onmousemove = null;
			}
			document.onkeydown = null;

			let leftButtonList = document.querySelectorAll("#left");
			for (let i = 0; i < leftButtonList.length; i++) {
				let leftButton = leftButtonList[i];
				leftButton.onclick = null;
			}
			let rightButtonList = document.querySelectorAll("#right");
			for (let i = 0; i < rightButtonList.length; i++) {
				let rightButton = rightButtonList[i];
				rightButton.onclick = null;
			}
		} else {
			let container = node;
			let leftButton = document.querySelector("#" + container.id + " #left");
			leftButton.onclick = null;
			let rightButton = document.querySelector("#" + container.id + " #right");
			rightButton.onclick = null;

			let images = document.querySelector("#" + container.id + " #images");
			images.onmousedown = null;
			images.onmousemove = null;
		}



	}

}
Carousel.prototype = {
	constructor: Carousel,
	init() {
		var localcontainerIndex = containerIndex;
		containerArray[localcontainerIndex].style.margin = "auto";
		containerArray[localcontainerIndex].style.marginBottom = "30px";
		containerArray[localcontainerIndex].style.overflow = "hidden";
		containerArray[localcontainerIndex].style.position = "relative";
		containerArray[localcontainerIndex].innerHTML += "<div id='images'> </div>" +
			"<div id='pointDiv'> </div>" +
			"<div class='button' id='left'> &lt; </div>" +
			"<div class='button' id='right'> &gt; </div>";
	},
	imagesInit(carousel) {
		var localcontainerIndex = containerIndex;
		var containerId = containerArray[localcontainerIndex].id;
		var images = document.querySelector("#" + containerId + " #images");
		// 为了无缝轮播,首添加三张图片
		for (let i = carousel.imagesList.length - 3; i < carousel.imagesList.length; i++) {
			images.innerHTML += "<img src=" + carousel.imagesList[i] + " />";
		}
		for (let image in carousel.imagesList) {
			images.innerHTML += "<img src=" + carousel.imagesList[image] + " />";
		}
		// 为了无缝轮播,尾各添加三张图片
		for (let i = 0; i < 3; i++) {
			images.innerHTML += "<img src=" + carousel.imagesList[i] + " />";
		}


		// 设置图片的尺寸
		var allImages = document.querySelector("#" + containerId + " #images").childNodes;
		let maxImageHeight = 0;

		for (let i = 1; i < allImages.length; i++) {


			if (carousel.imageSize != null && carousel.imageSize !== undefined && typeof carousel.imageSize != NaN) {

				if (carousel.imageSize.height != null && carousel.imageSize.height !== undefined && typeof carousel.imageSize.height !=
					NaN) {
					allImages[i].style.height = carousel.imageSize.height + "px";
				} else {
					allImages[i].style.height = "150px";
				}
				if (carousel.imageSize.width != null && carousel.imageSize.width !== undefined && typeof carousel.imageSize.width !=
					NaN) {
					allImages[i].style.width = carousel.imageSize.width + "px";
				} else {
					allImages[i].style.width = "300px";
				}

			} else {
				// 图片宽高默认值
				allImages[i].style.height = "150px";
				allImages[i].style.width = "300px";
			}

			allImages[i].style.verticalAlign = "top";

			imageWidth = allImages[i].style.width;
		}

		allImages[8].style.height = "200px";

		for (let i = 1; i < allImages.length; i++) {
			if (maxImageHeight < parseInt(allImages[i].style.height)) {
				maxImageHeight = parseInt(allImages[i].style.height);
			}
		}

		// 设置图片列表div高度为最高的图片的高度
		images.style.height = maxImageHeight + "px";

		document.getElementById(containerId).style.height = allImages[4].style.height;

		// 设置窗口宽度为显示图片数*图片宽度
		if (carousel.displayNum != null && carousel.displayNum !== undefined && typeof carousel.displayNum != NaN) {
			document.getElementById(containerId).style.width = carousel.displayNum * parseInt(allImages[1].style.width) + "px";
		}

		// 滑动距离
		slidePx = slideNum * parseInt(allImages[1].style.width);

		// 初始化left值
		var newLeft = -(parseInt(allImages[1].style.width) * 3);

		images.style.width = (parseInt(window.getComputedStyle(containerArray[localcontainerIndex], null).width) *
			imageListLength) + "px";
		images.style.left = parseInt(newLeft) + "px";
		images.style.top = "0";
		images.style.position = "absolute";
		images.style.zIndex = "1";
		images.style.transitionProperty = "all";
		images.style.transitionDuration = transitionDuration;


	},

	pointDivInit(carousel) {
		var localcontainerIndex = containerIndex;
		var containerId = containerArray[localcontainerIndex].id;
		var pointDiv = document.querySelector("#" + containerId + " #pointDiv");
		pointDiv.style.position = "absolute";
		pointDiv.style.zIndex = "2";
		pointDiv.style.left = "45%";
		pointDiv.style.bottom = "7%";
		// 根据图片数量计算小圆点数量
		pointDiv.innerHTML += "<span index='0' class='on'> </span>";
		var count = slidePx / parseInt(imageWidth);
		for (let i = 1; i < carousel.imagesList.length / count; i++) {
			pointDiv.innerHTML += "<span index='" + i + "'> </span>"
		}

		// 用户自定义小圆点样式
		var spanList = document.querySelectorAll("#" + containerId + " #" + pointDiv.id + " span");
		console.log("@@@@@@@@  spanList:" + spanList.length);

		let havePointStyle = false;
		if (carousel.pointStyle != null && carousel.pointStyle !== undefined) {
			havePointStyle = true;
		}

		for (let i = 0; i < spanList.length; i++) {

			var point = spanList[i];
			point.style.float = "left";
			point.style.marginRight = havePointStyle && haveSpecificStyle(carousel.pointStyle.marginRight) ?
				carousel.pointStyle.marginRight : "5px";

			point.style.width = havePointStyle && haveSpecificStyle(carousel.pointStyle.width) ?
				carousel.pointStyle.width : "10px";

			point.style.height = havePointStyle && haveSpecificStyle(carousel.pointStyle.height) ?
				carousel.pointStyle.height : "10px";

			point.style.borderWidth = havePointStyle && haveSpecificStyle(carousel.pointStyle.borderWidth) ?
				carousel.pointStyle.borderWidth : "1px";

			point.style.borderStyle = havePointStyle && haveSpecificStyle(carousel.pointStyle.borderStyle) ?
				carousel.pointStyle.borderStyle : "solid";

			point.style.borderColor = havePointStyle && haveSpecificStyle(carousel.pointStyle.borderColor) ?
				carousel.pointStyle.borderColor : "white";

			point.style.borderRadius = havePointStyle && haveSpecificStyle(carousel.pointStyle.borderRadius) ?
				carousel.pointStyle.borderRadius : "50%";

			point.style.backgroundColor = havePointStyle && haveSpecificStyle(carousel.pointStyle.backgroundColor) ?
				carousel.pointStyle.backgroundColor : "transparent !important";

			point.style.cursor = havePointStyle && haveSpecificStyle(carousel.pointStyle.cursor) ?
				carousel.pointStyle.cursor : "pointer";

			if (i == 0) {
				spanList[i].className = "on";
				console.log("spanList[i].className:" + spanList[i].className);
				point.style.backgroundColor = havePointStyle && haveSpecificStyle(carousel.pointStyle.focusBackgroundColor) ?
					carousel.pointStyle.focusBackgroundColor : "orange";

				focusBackgroundColor = point.style.backgroundColor;
			}
		}

	},

	buttonInit(carousel) {
		var localcontainerIndex = containerIndex;
		var containerId = containerArray[localcontainerIndex].id;
		var leftButton = document.querySelector("#" + containerId + " #left");
		var rightButton = document.querySelector("#" + containerId + " #right");


		let havebuttonStyle = false;
		if (carousel.buttonStyle != null && carousel.buttonStyle !== undefined) {
			havebuttonStyle = true;
		}

		// 用户自定义按钮样式
		leftButton.style.margin = "auto";
		leftButton.style.position = "absolute";
		leftButton.style.zIndex = "2";
		leftButton.style.backgroundColor = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.backgroundColor) ?
			carousel.buttonStyle.backgroundColor : "transparent";
		leftButton.style.width = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.width) ? carousel.buttonStyle.width :
			"30px";
		leftButton.style.height = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.height) ? carousel.buttonStyle.height :
			"30px";
		leftButton.style.borderRadius = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderRadius) ? carousel.buttonStyle
			.borderRadius : "50%";
		leftButton.style.borderStyle = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderStyle) ? carousel.buttonStyle
			.borderStyle : "solid";
		leftButton.style.borderColor = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderColor) ? carousel.buttonStyle
			.borderColor : "mediumpurple";
		leftButton.style.borderWidth = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderWidth) ? carousel.buttonStyle
			.borderWidth : "1px";
		leftButton.style.lineHeight = "26px";
		leftButton.style.textAlign = "center";
		leftButton.style.fontSize = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.fontSize) ? carousel.buttonStyle
			.fontSize : "25px";
		leftButton.style.color = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.color) ? carousel.buttonStyle.color :
			"#E9967A";
		leftButton.style.top = "40%";
		leftButton.style.cursor = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.cursor) ? carousel.buttonStyle.cursor :
			"pointer";

		rightButton.style.margin = "auto";
		rightButton.style.position = "absolute";
		rightButton.style.zIndex = "2";
		rightButton.style.backgroundColor = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.backgroundColor) ?
			carousel.buttonStyle.backgroundColor : "transparent";
		rightButton.style.width = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.width) ? carousel.buttonStyle.width :
			"30px";
		rightButton.style.height = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.height) ? carousel.buttonStyle
			.height : "30px";
		rightButton.style.borderRadius = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderRadius) ? carousel
			.buttonStyle.borderRadius : "50%";
		rightButton.style.borderStyle = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderStyle) ? carousel.buttonStyle
			.borderStyle : "solid";
		rightButton.style.borderColor = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderColor) ? carousel.buttonStyle
			.borderColor : "mediumpurple";
		rightButton.style.borderWidth = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.borderWidth) ? carousel.buttonStyle
			.borderWidth : "1px";
		rightButton.style.lineHeight = "26px";
		rightButton.style.textAlign = "center";
		rightButton.style.fontSize = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.fontSize) ? carousel.buttonStyle
			.fontSize : "25px";
		rightButton.style.color = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.color) ? carousel.buttonStyle.color :
			"#E9967A";
		rightButton.style.top = "40%";
		rightButton.style.cursor = havebuttonStyle && haveSpecificStyle(carousel.buttonStyle.cursor) ? carousel.buttonStyle
			.cursor : "pointer";

		leftButton.style.left = "20px";
		rightButton.style.right = "20px";
	},

	addButtonEvent() {
		var localcontainerIndex = containerIndex;
		var containerId = containerArray[localcontainerIndex].id;
		var leftButton = document.querySelector("#" + containerId + " #left");
		var rightButton = document.querySelector("#" + containerId + " #right");
		var container = document.getElementById(containerId);
		var points = document.querySelector("#" + containerId + " #pointDiv").getElementsByTagName("span");
		console.log("-------------pointDiv containerId:" + containerId);

		// 用户自定义按钮
		var userLeftButton = document.getElementsByName("leftButton");
		var userRightButton = document.getElementsByName("rightButton");
		if (userLeftButton != null && userLeftButton.length > 0) {
			for (let i = 0; i < userLeftButton.length; i++) {
				userLeftButton[i].onclick = leftMove;
			}
		}
		if (userRightButton != null && userRightButton.length > 0) {
			for (let i = 0; i < userRightButton.length; i++) {
				userRightButton[i].onclick = rightMove;
			}
		}
		// 暂停自动轮播
		var userStopButton = document.getElementsByName("stopButton");
		if (userStopButton != null && userStopButton.length > 0) {
			for (let i = 0; i < userStopButton.length; i++) {
				userStopButton[i].onclick = function() {
					for (let i = 0; i < containerArray.length; i++) {
						clearInterval(timer[containerArray[i].id]);
					}
					console.log("点击暂停，暂停全部自动轮播");
				};
			}
		}
		// 重启自动轮播
		var userRestartButton = document.getElementsByName("restartButton");
		if (userRestartButton != null && userRestartButton.length > 0) {
			for (let i = 0; i < userRestartButton.length; i++) {
				userRestartButton[i].onclick = function() {
					for (let i = 0; i < containerArray.length; i++) {

						let button = document.querySelector("#" + containerArray[i].id + " #right");

						timer[containerArray[i].id] = setInterval(function() {
							button.click();
						}, intervalSeconds * 1000);
					}
					console.log("点击重启，启动全部自动轮播");
				};
			}
		}

		leftButton.onclick = function() {
			var e = window.event;
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.cancelBubble = true;
			e.returnValue = false;
			leftMove();
		}

		rightButton.onclick = function() {
			var e = window.event;
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.cancelBubble = true;
			e.returnValue = false;
			rightMove();
		}

		// rightButton.addEventListener("click", rightMove);
		// 鼠标放上时停止轮播,离开继续轮播
		containerArray[localcontainerIndex].onmouseover = this.stop;
		containerArray[localcontainerIndex].onmouseout = this.play;

		// 鼠标拖动事件
		if (mouseDrag) {
			var clientX;
			document.querySelector("#" + containerArray[localcontainerIndex].id + " #images").ondragstart = function() {
				console.log("鼠标按下！！！！");
				clientX = window.event.clientX;
				console.log("鼠标移动！！！！");
				// 取消事件冒泡和默认行为
				// 防止因为默认行为导致图片被拖动出来导致up事件无法响应
				var e = window.event;
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				e.cancelBubble = true;

				// 在使用H5的drag特性时，发现元素默认是有拖动效果，但是如果设置了preventDefault()或者returnValue = false取消了默认动作，元素可以监听到拖动的开始，但是无法监听拖动过程和结束事件。
				console.log("%%%%%%%%%  localcontainerIndex:" + localcontainerIndex);
				console.log(containerArray[localcontainerIndex].draggable);



			}
			document.querySelector("#" + containerArray[localcontainerIndex].id + " #images").ondragend = function() {


				console.log("鼠标抬起！！！！");
				var distance = window.event.clientX - clientX;
				console.log(distance);
				if (parseInt(distance) < 0) {
					rightMove();
				} else {
					leftMove();
				}
			}
		}

		if (keyBoardEvent) {
			document.onkeydown = function() {
				if (window.event.keyCode == 37) {
					console.log("键盘←按下！！");
					leftMove();
				}
				if (window.event.keyCode == 39) {
					console.log("键盘→按下！！");
					rightMove();
				}
			}
		}



		// 为小圆点添加点击切换图片事件

		for (var i = 0; i < points.length; i++) {
			points[i].addEventListener("click", function() {
				var clickIndex = parseInt(this.getAttribute('index'));

				// 窗口宽度/每次移动的宽度，计算小圆点的位置
				let containerCount = parseInt(window.getComputedStyle(containerArray[localcontainerIndex], null).width) /
					slidePx;
				let moveCount = slidePx / parseInt(imageWidth);
				let finalCount;

				if (containerCount == 1 && moveCount == 3) {
					// 3-3 情况
					finalCount = 1;
				} else if (containerCount == 1 && moveCount == 2) {
					// 2-2情况
					finalCount = 1.5;
				} else if (containerCount == 1 && moveCount == 1) {
					// 1-1情况
					finalCount = 3;
				} else if (containerCount == 3) {
					// 3-1 情况
					finalCount = containerCount;
				} else if (containerCount == 2) {
					// 3-1 情况
					finalCount = 3;
				}
				var newLeft = (clickIndex + finalCount) * -(slidePx);
				console.log("小圆点移动，finalCount：" + finalCount);
				console.log("小圆点移动，newLeft：" + newLeft);
				console.log("小圆点移动，containerId：" + containerId);
				let images = document.querySelector("#" + containerId + " #images");
				images.style.transitionProperty = "left";
				images.style.transitionDuration = " " + transitionDuration;
				images.style.left = newLeft + 'px';

				//清除原来的样式,并为新的添加
				for (var i = 0; i < points.length; i++) {
					if (points[i].className == "on") {
						points[i].className = "";
						points[i].style.backgroundColor = (i - 1) < 0 ? points[i + 1].style.backgroundColor : points[i - 1].style.backgroundColor;
					}
				}
				points[clickIndex].className = "on";
				points[clickIndex].style.backgroundColor = focusBackgroundColor;

				changeContainerHeight(images);
			});
		}
	},

	// 定时器
	play() {
		if (autoSlide) {
			var localcontainerIndex = containerIndex;
			var containerId = containerArray[localcontainerIndex].id;
			if (window.event !== undefined) {
				containerId = window.event.target.parentNode.parentNode.id;
				if (containerId == '') {
					containerId = window.event.target.parentNode.id;
				}

			}
			let button = document.querySelector("#" + containerId + " #right");

			if (!leftToRightSlide) {
				button = document.querySelector("#" + containerId + " #left");
			}


			timer[containerId] = setInterval(function() {
				button.click();
			}, intervalSeconds * 1000);
			console.log("启动定时器 timer[containerId]:" + timer[containerId]);
			console.log("启动定时器*********** containerId:" + containerId);
			console.log("启动定时器*********** timer.length:" + Object.getOwnPropertyNames(timer).length);
		}
	},

	stop() {
		var localContainerId = window.event.target.parentNode.parentNode.id;
		if (autoSlide) {
			clearInterval(timer[localContainerId]);
			console.log("清除定时器 timer[containerId]:" + timer[localContainerId]);
			console.log("清除定时器*********** containerId:" + localContainerId);
			console.log("清除定时器*********** timer.length:" + Object.getOwnPropertyNames(timer).length);
		}
	},


}

// 圆点样式切换
function moveOn(type, localContainerId) {
	console.log("---圆点样式切换 localContainerId: " + localContainerId);
	var index = 0;
	var points = document.querySelector("#" + localContainerId + " #pointDiv").getElementsByTagName("span");
	for (var i = 0; i < points.length; i++) {
		if (points[i].className == "on") {
			index = i;
			points[i].className = "";
			points[i].style.backgroundColor = (i - 1) < 0 ? points[i + 1].style.backgroundColor : points[i - 1].style.backgroundColor;
		}
	}
	if (type == "left") {
		if (index - 1 < 0) {
			index = points.length;
		}
		console.log("圆点左移 moveOn left index-1: " + (index - 1));
		points[index - 1].className = "on";
		points[index - 1].style.backgroundColor = focusBackgroundColor;
	} else if (type == "right") {
		if (index + 1 >= points.length) {
			index = -1;
		}
		console.log("圆点右移 moveOn right index+1: " + (index + 1));
		points[index + 1].className = "on";
		points[index + 1].style.backgroundColor = focusBackgroundColor;
	}
}

// 右滑一张
function rightMove() {
	var containerId = window.event.target.parentNode.id;
	console.log("   ");
	console.log("!!!!!!!!!!  containerId: " + containerId);
	if (containerId == "images") {
		containerId = window.event.target.parentNode.parentNode.id;
	}

	if (containerId == "") {
		for (let i = 0; i < containerArray.length; i++) {
			containerId = containerArray[i].id;
			realRightMove(containerId);
		}
	} else {
		realRightMove(containerId);
	}

	function realRightMove(containerId) {
		var images = document.querySelector("#" + containerId + " #images");
		if (images == null) {
			return;
		}
		// 防止动画没播放完就点击按钮切换
		var newLeft = parseInt(images.style.left);
		console.log("parseInt(window.getComputedStyle(images, null).left):" + parseInt(window.getComputedStyle(images, null).left) +
			"newLeft:" + newLeft);
		console.log("---------images.style.left::" + images.style.left);
		if (parseInt(window.getComputedStyle(images, null).left) != newLeft) {
			console.log("没播放完！！！containerId: " + containerId);
			return;
		}

		//不循环播放
		if (!recycleSlide) {
			if (parseInt(newLeft) == -(parseInt(imageWidth) * (imageListLength - 3 - 1))) {
				console.log("不循环播放，播放完成");
				return;
			}
		}


		newLeft = parseInt(window.getComputedStyle(images, null).left) - slidePx;
		console.log("slidePx:" + slidePx);
		console.log("imageWidth:" + parseInt(imageWidth));

		// 适配每次滑1、2、3张，显示1、2、3张
		var temp;
		if (slidePx / parseInt(imageWidth) <= 1) {
			temp = imageListLength - 6 - 1;
		} else if (slidePx / parseInt(imageWidth) <= 2) {
			temp = (imageListLength - 6) / 2 - 1;
		} else if (slidePx / parseInt(imageWidth) <= 3) {
			temp = (imageListLength - 6) / 3 - 3;
		}


		if (newLeft < (-(slidePx) * (temp + 3))) {
			console.log("-------开始无缝过渡--------");

			setTimeout(function() {
				images.style.transitionProperty = "none";
				images.style.transitionDuration = "0s";
				images.style.left = -parseInt(imageWidth) * 3 + 'px';
				newLeft = -parseInt(imageWidth) * 3;
			}, 500);
			images.style.transitionProperty = "all";
			images.style.transitionDuration = transitionDuration + "s";

		} else {
			images.style.transitionProperty = "all";
			images.style.transitionDuration = transitionDuration + "s";

		}

		images.style.left = newLeft + 'px';
		console.log("图片右滑 rightMove newLeft: " + newLeft);
		moveOn("right", containerId);
		changeContainerHeight(images);
	}


}

// 左滑一张
function leftMove(containerId) {
	var containerId = window.event.target.parentNode.id;
	console.log("左滑一张---------containerId:" + containerId);
	if (containerId == "images") {
		containerId = window.event.target.parentNode.parentNode.id;
	}
	if (containerId == "") {
		for (let i = 0; i < containerArray.length; i++) {
			containerId = containerArray[i].id;
			realLeftMove(containerId);
		}
	} else {
		realLeftMove(containerId);
	}

	function realLeftMove(containerId) {
		let images = document.querySelector("#" + containerId + " #images");
		if (images == null) {
			return;
		}
		let newLeft = parseInt(images.style.left);

		if (!recycleSlide) {
			if (parseInt(newLeft) == -parseInt(imageWidth) * 3) {
				console.log("不循环播放，播放完成");
				return;
			}
		}

		// 防止动画没播放完就点击按钮切换
		if (parseInt(window.getComputedStyle(images, null).left) != newLeft) {
			return;
		}
		newLeft = parseInt(window.getComputedStyle(images, null).left) + slidePx;

		var temp;
		if (slidePx / parseInt(imageWidth) <= 1) {
			temp = imageListLength - 6 - 1;
		} else if (slidePx / parseInt(imageWidth) <= 2) {
			temp = (imageListLength - 6) / 2 - 2.5;
		} else if (slidePx / parseInt(imageWidth) <= 3) {
			temp = (imageListLength - 6) / 3 - 3;
		}
		temp += 3;

		if (newLeft > -(parseInt(imageWidth)) * 3) {

			setTimeout(function() {
				images.style.transitionProperty = "none";
				images.style.transitionDuration = "0s";
				images.style.left = -(slidePx) * temp + 'px';

				newLeft = -(slidePx) * temp;
			}, 500);
			images.style.transitionProperty = "all";
			images.style.transitionDuration = transitionDuration + "s";

		} else {
			images.style.transitionProperty = "all";
			images.style.transitionDuration = transitionDuration + "s";
		}
		images.style.left = newLeft + 'px';
		console.log("图片左滑 leftMove newLeft: " + newLeft);
		moveOn("left", containerId);
		changeContainerHeight(images);
	}


}

// 根据图片高度调整窗口宽度
function changeContainerHeight(images) {
	var containerId = images.parentNode.id;
	let newLeft = parseInt(images.style.left);
	const imageIndex = -parseInt(newLeft) / parseInt(imageWidth);
	console.log("imageIndex：：" + imageIndex);
	var allImages = document.querySelector("#" + containerId + " #images").childNodes;
	let start = imageIndex + 1;
	let end = imageIndex + 1 + displayNum;
	let maxImageHeight = 0;
	for (let i = start; i < end; i++) {
		if (maxImageHeight < parseInt(allImages[i].style.height)) {
			maxImageHeight = parseInt(allImages[i].style.height);
		}
	}
	console.log("maxImageHeight::" + maxImageHeight);
	images.parentNode.style.height = maxImageHeight + "px";
}



function haveSpecificStyle(style) {
	if (style != null && style != "") {
		return true;
	}
	return false;
}


var t = new Array(100000);
console.time('time1');
for (var i = 0; i < 100000; ++i) {
	t.push(1);
}
console.timeEnd('time1');
var t2 = [];
console.time('time2');
for (var i = 0; i < 100000; ++i) {
	t.push(1);
}
console.timeEnd('time2');

console.time('time3');
var temp = 0;
for (let i = 0; i < t2.length; i++) {
	temp = t2[i];
}
console.timeEnd('time3');

console.time('time4');
var temp = 0;
for (let i = 0; i < t.length; i++) {
	temp = t[i];
}
console.timeEnd('time4');

console.time('time5');
var temp2 = 0;
for (let i = 0; i < t2.length; i+=500) {
	temp = t2[i];
}
console.timeEnd('time5');

console.time('time6');
var temp2 = 0;
for (let i = 0; i < t.length; i+=500) {
	temp = t[i];
}
console.timeEnd('time6');

// 性能 & 集成、设备访问 Device Access
// 完善V8下数组的学习笔记
// 学习less

// 今天在研究V8中数组的源码时,看到快慢数组转换的条件,源码中有个kMaxGap为1024,当加入的index-当前capacity>=1024,或者新容量超过了设定阀值，就会转变为慢数组.当慢数组的元素可存放在快数组中且长度在smi之间且仅节省了50%的空间,则会转变为快数组