/*
 * 创建一个包含所有卡片的数组
 */
var arr = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube'];

// 初始数据
var movesObj = document.getElementsByClassName('moves')[0];
var moves = 0;
var matched = 0;
var start = false;
var timeNum = document.getElementsByClassName('time')[0];
/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */
var deck = document.getElementsByClassName('deck')[0];

var open = [];
var items = deck.childNodes;

console.log(items);

function init() {
	// 随机数据
	var randomArr = shuffle(arr);
	
	// 如果并非首次初始化
	if (items.length >= 2) {
		var i = items.length - 1;
		while (i > 0) {
			deck.removeChild(items[i]);
			i--;
		}
	}

	// 初始随机数据
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

// 奇怪
init();

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
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


/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */

function monitor() {
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener('click', function() {
			// 计时器
			if (!start) {
				start = true;
				calculateTime();
			}

			// 增加移动次数
			addMoves();

			// 已匹配过的牌
			if (event.target.classList[1] == 'match') {
				return false;
			}

			// 重复点击同一张卡牌
			if (event.target.classList[1] == 'open') {
				return false;
			}

			// 显示卡片的符号 函数
			showCard(event);

			// 将卡片添加到状态为 'open' 的数组中 函数
			pushOpen(event);

			// 检测两张卡是否匹配
			if (open.length == 2) {
				if (open[0] == open[1]) {
					matchSuccess();
				} else {
					matchFail();
				}
			}

			if (matched == 8) {
				gameSuccess();
			}

		})
	}
}

function addMoves() {
	moves++;
	movesObj.innerText = moves;
}

function showCard(event) {
	event.target.classList.add('open', 'show');
}

function pushOpen(event) {
	open.push(event.target.childNodes[0].classList[1].slice(3));
}

function matchSuccess() {
	setTimeout(function() {
		for (var i = 1; i < items.length; i++) {
			if (items[i].childNodes[0].classList[1].slice(3) == open[0] || items[i].childNodes[0].classList[1].slice(3) == open[1]) {
				items[i].classList.remove('open', 'show');
				items[i].classList.add('match');
			}
		}

		open = [];
	}, 1000);

	matched++;
}

function matchFail() {
	// console.log(items[1].childNodes[0].classList[1]);
	// 整个 items 节点包含一个 text 节点
	setTimeout(function() {
		for (var i = 1; i < items.length; i++) {
			if (items[i].childNodes[0].classList[1].slice(3) == open[0] || items[i].childNodes[0].classList[1].slice(3) == open[1]) {
				items[i].classList.remove('open', 'show');
			}
		}

		open = [];
	}, 1000);
}

function gameSuccess() {
	alert('游戏胜利，你的步数为' + moves + '，时间为：' + timeNum.innerText);
	start = false;
}

function calculateTime() {
	var timer = setInterval(function() {
		timeNum.innerText = parseInt(timeNum.innerText) + 1;
		if (!start) {
			clearInterval(timer);
		}
	}, 1000);
}

var repeat = document.getElementsByClassName('fa-repeat')[0];
repeat.addEventListener('click', function() {
	open = [];
	start = false;
	timeNum.innerText = 0;
	movesObj.innerText = 0;
	moves = 0;
	matched = 0;

	for (var i = 1; i < items.length; i++) {
		items[i].classList.remove('open', 'show', 'match');
	}

	init();
});