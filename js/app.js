// 初始数据
const arr = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube'];

const movesObj = document.getElementsByClassName('moves')[0];
// 步数
let moves = 0;

// 匹配次数
let matched = 0;

// 星级数
let stars = 3;

// 游戏状态
let start = false;

// 避免点击过快
let ban = false;

let timeNum = document.getElementsByClassName('time')[0];
let deck = document.getElementsByClassName('deck')[0];

// 临时匹配容器
let open = [];

// 所有的卡牌
const items = deck.childNodes;

/**
 * @description  初始化数据
 */
function init() {
	// 卡片洗牌
	let randomArr = shuffle(arr);

	// 如果并非首次初始化
	if (items.length >= 2) {
		let i = items.length - 1;
		while (i > 0) {
			deck.removeChild(items[i]);
			i--;
		}
	}

	// 循环遍历每张卡片，创建其 HTML，将每张卡的 HTML 添加到页面
	for (let i = 0; i < randomArr.length; i++) {
		let card = document.createElement('li');
		card.className = 'card';
		let ie = document.createElement('i');
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
	let currentIndex = array.length,
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
	for (let i = 0; i < items.length; i++) {
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
			if (this.classList[1] == 'match') {
				return false;
			}

			// 重复点击同一张卡牌
			if (this.classList[1] == 'open') {
				return false;
			}

			// 增加移动次数
			addMoves();

			// 显示卡片的符号
			showCard(this);

			// 将卡片添加到状态为 'open' 的数组中
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

		});
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
		for (let i = 1; i < items.length; i++) {
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
		for (let i = 1; i < items.length; i++) {
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
	let movesResult = document.getElementsByClassName('moves')[1];
	movesResult.innerText = moves;
	let timeResult = document.getElementsByClassName('time')[1];
	timeResult.innerText = timeNum.innerText;
}


/**
 * 游戏计时
 */
function calculateTime() {
	let timer = setInterval(function() {
		// 结束计时
		if (!start) {
			clearInterval(timer);
			return false;
		}

		timeNum.innerText = parseInt(timeNum.innerText) + 1;

		// 星级评定
		calculateStars();

	}, 1000);
}

// 游戏首次加载
init();

let repeat = document.getElementsByClassName('fa-repeat')[0];
let scorePanel = document.getElementsByClassName('score-panel')[0];
let successBoard = document.getElementsByClassName('success-board')[0];

// 为重置绑定点击事件
repeat.addEventListener('click', function() {
	repeatGame();
});

let again = document.getElementsByClassName('again')[0];

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
	for (let i = 1; i < items.length; i++) {
		items[i].classList.remove('open', 'show', 'match');
	}

	// 重新初始化
	init();
}

/**
 * @description 星级评定
 */
function calculateStars() {
	let starsObj = document.getElementsByClassName('stars');
	if (moves >= 30 && moves < 60) {
		stars = 2;
	} else if (moves >= 60) {
		stars = 1;
	}
	starsObj[0].innerHTML = '';
	starsObj[1].innerHTML = '';
	for (let i = 0; i < stars; i++) {
		for (let j = 0; j < starsObj.length; j++) {
			starsObj[j].innerHTML += '<li><i class="fa fa-star"></i></li> ';
		}
	}


}