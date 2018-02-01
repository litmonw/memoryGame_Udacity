// 初始数据
var arr = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube'];

var movesObj = document.getElementsByClassName('moves')[0];
// 步数
var moves = 0;

// 匹配次数
var matched = 0;

// 星级数
var stars = 3;

// 游戏状态
var start = false;

// 避免点击过快
var ban = false;

var timeNum = document.getElementsByClassName('time')[0];
var deck = document.getElementsByClassName('deck')[0];

// 临时匹配容器
var open = [];

// 所有的卡牌
var items = deck.childNodes;

/**
 * @description  初始化数据
 */
function init() {
	// 卡片洗牌
	var randomArr = shuffle(arr);

	// 如果并非首次初始化
	if (items.length >= 2) {
		var i = items.length - 1;
		while (i > 0) {
			deck.removeChild(items[i]);
			i--;
		}
	}

	// 循环遍历每张卡片，创建其 HTML，将每张卡的 HTML 添加到页面
	for (var i = 0; i < randomArr.length; i++) {
		var card = document.createElement('li');
		card.className = 'card';
		var ie = document.createElement('i');
		ie.className = 'fa fa-' + randomArr[i];
		card.appendChild(ie);
		deck.appendChild(card);
	}

	// 添加事件
	monitor();
}
/**
 * 洗牌函数来自于 http://stackoverflow.com/a/2450976
 * @returns {array} 随机排序之后的数组
 */
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/**
 * @description 绑定卡牌点击事件
 */
function monitor() {
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener('click', function() {

			// 首次点击时开始计时
			if (!start) {
				start = true;
				calculateTime();
			}

			// 放置点击过快
			if (ban) {
				return false;
			}

			// 已匹配过的牌
			console.log(this.classList[1]);
			if (this.classList[1] == 'match') {
				return false;
			}

			// 重复点击同一张卡牌
			if (this.classList[1] == 'open') {
				return false;
			}

			// 增加移动次数
			addMoves();

			// 显示卡片的符号 函数
			showCard(this);

			// 将卡片添加到状态为 'open' 的数组中 函数
			pushOpen(this);

			// 检测两张卡是否匹配
			if (open.length == 2) {
				ban = true;
				if (open[0] == open[1]) {
					matchSuccess();
				} else {
					matchFail();
				}
			}

			if (matched == 8) {
				gameSuccess();
			}

		}, true);
	}
}

/**
 * @description 移动次数更改
 */
function addMoves() {
	moves++;
	movesObj.innerText = moves;
}

/**
 * @description 显示卡牌
 * @param event - Event 对象
 */
function showCard(event) {
	event.classList.add('open', 'show');
}

/**
 * @description 添加卡牌
 * @param event - Event 对象
 */
function pushOpen(event) {
	open.push(event.childNodes[0].classList[1].slice(3));
}

/**
 * 匹配卡牌成功
 */
function matchSuccess() {
	setTimeout(function() {
		for (var i = 1; i < items.length; i++) {
			if (items[i].childNodes[0].classList[1].slice(3) == open[0] || items[i].childNodes[0].classList[1].slice(3) == open[1]) {
				items[i].classList.remove('open', 'show');
				items[i].classList.add('match');
			}
		}

		open = [];
		ban = false;
	}, 1000);

	matched++;
}

/**
 * 匹配卡牌失败
 */
function matchFail() {
	setTimeout(function() {
		for (var i = 1; i < items.length; i++) {
			if (items[i].childNodes[0].classList[1].slice(3) == open[0] || items[i].childNodes[0].classList[1].slice(3) == open[1]) {
				items[i].classList.remove('open', 'show');
			}
		}

		// 清空临时匹配容器
		open = [];
		// 允许继续点击
		ban = false;
	}, 1000);
}

/**
 * 游戏胜利
 */
function gameSuccess() {
	start = false;

	// 显示游戏面板
	deck.classList.add('hide');
	scorePanel.classList.add('hide');
	successBoard.classList.remove('hide');

	// 显示游戏最终得分
	var movesResult = document.getElementsByClassName('moves')[1];
	movesResult.innerText = moves;
	var timeResult = document.getElementsByClassName('time')[1];
	timeResult.innerText = timeNum.innerText;
}


/**
 * 游戏计时
 */
function calculateTime() {
	var timer = setInterval(function() {
		// 结束计时
		if (!start) {
			clearInterval(timer);
		}

		timeNum.innerText = parseInt(timeNum.innerText) + 1;

		// 星级评定
		calculateStars();

	}, 1000);
}

// 游戏首次加载
init();

var repeat = document.getElementsByClassName('fa-repeat')[0];
var scorePanel = document.getElementsByClassName('score-panel')[0];
var successBoard = document.getElementsByClassName('success-board')[0];

// 为重置绑定点击事件
repeat.addEventListener('click', function() {
	repeatGame();
});

var again = document.getElementsByClassName('again')[0];

// 为重玩绑定点击事件
again.addEventListener('click', function() {
	repeatGame();
	deck.classList.remove('hide');
	scorePanel.classList.remove('hide');
	successBoard.classList.add('hide');
});

function repeatGame() {
	// 初始化所有游戏数据
	open = [];
	start = false;
	timeNum.innerText = 0;
	movesObj.innerText = 0;
	moves = 0;
	matched = 0;

	//重置星级评分
	stars = 3;
	calculateStars();

	// 移除旧游戏卡牌
	for (var i = 1; i < items.length; i++) {
		items[i].classList.remove('open', 'show', 'match');
	}

	// 重新初始化
	init();
}

/**
 * @description 星级评定
 */
function calculateStars() {
	var starsObj = document.getElementsByClassName('stars');
	if (moves >= 30 && moves < 60) {
		stars = 2;
	} else if (moves >= 60) {
		stars = 1;
	}
	starsObj[0].innerHTML = '';
	starsObj[1].innerHTML = '';
	for (var i = 0; i < stars; i++) {
		for (var j = 0; j < starsObj.length; j++) {
			starsObj[j].innerHTML += '<li><i class="fa fa-star"></i></li> ';
		}
	}


}