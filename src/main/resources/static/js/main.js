const game = new Game();
const mask = document.querySelector('.mask');
const restartButton = document.querySelector('.restart');
const score = document.querySelector('.score');
const modal = document.getElementById('myModal');


const baseImgUrl = '../imgs/';
const baseJsonUrl = '../json/';
const name = document.getElementById('uname');
const modalImg = document.getElementById("imgModal"); //获取弹出图片元素
const modalBigImg = document.getElementById("bigIimgModal"); //获取弹出图片元素
const captionText = document.getElementById("caption"); //获得文本描述

const preImg = document.getElementById("preImg"); //获取弹出图片元素
const preBigImg = document.getElementById("preBigImg"); //获取弹出图片元素
let imgData;
let rankData;
let showBig = false;
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

$(rank).on("click",function(){
	$.ajax({
		url: "/rank/get",//json文件位置，文件名
		type: "GET",//请求方式为get
		dataType: "json", //返回数据格式为json
		async: true,
		success: function (data) {
			$(".list-container").empty();
			$(".list-container").append('<div class="list-item"><div class="item-num">' 
							+ ('排名') + '</div><div class="item-name">' + ('用户昵称') + '</div><div class="item-score">'
							+ ('完成比例') + '</div></div>');
			var rankData = data.obj[0];
			var topRankLength = rankData.length;
			if(rankData != null && rankData.length > 0){
				for(var i = 0;i < topRankLength;i++){
					$(".list-container").append('<div class="list-item"><div class="item-num">' 
							+ rankData[i].rankings + '</div><div class="item-name">' + rankData[i].userName + '</div><div class="item-score">'
							+ rankData[i].userScore + '%'+ '</div></div>');
				}
						
				$(".list-container .list-item:even").addClass("item-eve");
				$(".list-container .list-item:odd").addClass("item-odd");
				$(".list-container .list-item .item-num").eq(1).addClass("item-one");
				$(".list-container .list-item .item-num").eq(2).addClass("item-two");
				$(".list-container .list-item .item-num").eq(3).addClass("item-three");
			}

			var selfRankData = data.obj[1];
			if(selfRankData != null && selfRankData.length > 0) {
				$(".my-list .item-num").html(selfRankData[0].rankings);
				$(".my-list .item-name").html(selfRankData[0].userName);
				$(".my-list .item-score").html(selfRankData[0].userScore + '%');
			}

			$(".rank-mask").show();
			$(".rank-list").show();
		}
	});		
});

$(".rank-close").on("click",function(){
	$(".rank-mask").hide();
	$(".rank-list").hide();
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
	uploadScore($("#uname").val(), pro)
	$(".mask").hide();
	SetImage(baseImgUrl.concat(imgData[0].imgName), baseImgUrl.concat(imgData[0].imgName), imgData[0].info)
	game.restart()	
}


function uploadScore(uname, score) {
	if(uname != null && uname != "") {
		$.ajax({
				url: "/rank/update",//json文件位置，文件名
				type: "post",
				data: {
					username:uname,
					score:score
				},
				dataType: "json", //返回数据格式为json
				async: true,
				success: function(data){//请求成功完成后要执行的方法 
					rankData = data;	
				}
		});	
	}
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