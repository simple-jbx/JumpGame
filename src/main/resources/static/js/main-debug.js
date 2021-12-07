var game = new Game()
var mask = document.querySelector('.mask')
var restartButton = document.querySelector('.restart')
var closeImg = document.querySelector('.restart')
var continueButton = document.querySelector('.continue')
var score = document.querySelector('.score')

var baseImgUrl = './imgs/'
var baseJsonUrl = './json/'

var name = document.getElementById('uname');
var modalImg = document.getElementById("imgModal"); //获取弹出图片元素
var modalBigImg = document.getElementById("bigIimgModal"); //获取弹出图片元素
var captionText = document.getElementById("caption"); //获得文本描述

var preImg = document.getElementById("preImg"); //获取弹出图片元素
var preBigImg = document.getElementById("preBigImg"); //获取弹出图片元素


var imgData;
var rankData;
var showBig = false;
restartButton.addEventListener('click', restart)

game.init()
game.addSuccessFn(success)
game.addFailedFn(failed)


$.ajax({
	url: baseJsonUrl.concat('image.json'),//json文件位置，文件名
	type: "GET",//请求方式为get
	dataType: "json", //返回数据格式为json
	async: true,
	success: function(data) {//请求成功完成后要执行的方法 
		imgData = data;
		SetImage(baseImgUrl.concat(imgData[0].imgName), baseImgUrl.concat(imgData[0].imgName), imgData[0].info)
	}
});	

function showModal() {
	$(".modal").show();	
}

function closeModal() {
	if(game.score >= 0 && game.score < imgData.length) {
		SetImage(preImg.src, preBigImg.src, imgData[game.score].info);
	}

	$(".modal").hide();
	showBig = true;
}

function SetImage(imgPath, bigImgPath, imgText) {
    // 获取DIV弹窗
    // 获取图片插入到弹窗 - 使用 "alt" 属性作为文本部分的内容
	modalImg.src = imgPath; //将原图片URL赋给弹出图片元素
	modalBigImg.src = bigImgPath;
	captionText.innerHTML = imgText; //赋值文本内容给弹出框文本	
}

function switchImg() {
	var imgSrc = modalImg.src;
	modalImg.src = modalBigImg.src;
	modalBigImg.src = imgSrc;
}


function showBigImage(){
	if(game.score >= 1 && game.score <= imgData.length && imgData[game.score - 1].bigImgName != "") {
		switchImg()
	} 
}

// 游戏重新开始，执行函数
function restart() {
	var pro = game.score / imgData.length * 100;
	pro = pro.toFixed(2);
	$(".mask").hide();
	SetImage(baseImgUrl.concat(imgData[0].imgName), baseImgUrl.concat(imgData[0].imgName), imgData[0].info)
	game.restart()	
}


function showImg(score) {
	if(score >= 1 && score <= imgData.length) {		
		showModal();
		if(score < imgData.length) {
			var imgPath = baseImgUrl.concat(imgData[score].imgName);
			var bigImgPath = imgPath;
			if(imgData[score].bigImgName != "") {
				bigImgPath = baseImgUrl.concat(imgData[score].bigImgName);
			}
			preImg.src = imgPath
			preBigImg.src = bigImgPath
		}
	}
}


function setMaskInfo(infoTxt) {
	score.innerText = infoTxt;
	mask.style.display = 'flex';
}

// 游戏失败执行函数
function failed() {
	if(game.score <= 0) {
		setMaskInfo("很遗憾, 您未能开启本次征程！");
	} else {
		var pro = game.score / imgData.length * 100;
		pro = pro.toFixed(2);
		setMaskInfo("您本次完成了".concat(pro, "% 的征程，再接再厉"));
	}
}

// 游戏结束时函数
function finish(){
	setMaskInfo("恭喜您,您已经完成此次挑战！");
}


function updateScore(score){
	var scoreCurrent = document.querySelector('.score-current');
	if(score >= 1 && score < imgData.length) {
		scoreCurrent.innerText = imgData[score - 1].year;
	} else {
		scoreCurrent.innerText = "";
	}
}

// 游戏成功，更新分数
function success(score) {
	if(score <= imgData.length) {
		updateScore(score);
		showImg(score)
	} else {
		finish();
	}
}


function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
	        var pair = vars[i].split("=");
	        if(pair[0] == variable){return pair[1];}
	}
	return(false);
}