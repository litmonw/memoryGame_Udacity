// /**
//  * 洗牌函数来自于 http://stackoverflow.com/a/2450976
//  * @returns {iconsay} 随机排序之后的数组
//  */

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
 * @description 主游戏类
 * @constructor
 * @param {array} icons 可用的图标数组
 * @param {object} deckElm - deck 所在元素
 */ 
var Game = function (icons, deckElm) {
	this.icons = icons;
	this.deckElm = deckElm;
	
	// 临时匹配容器
	this.box = [];

	this.matchedNum = 0;

	this.state = false;

	this.time = 0;

	this.stars = 3;

	this.move = 0;
}

/**
 * @description 原型方法，用于初始化游戏
 */ 
Game.prototype.init = function() {
	let that = this; // 避免匿名函数 this 丢失绑定

	// 游戏初始化
	this.icons = shuffle(icons);
	this.time = 0;
	this.matchedNum = 0;
	this.state = false;
	this.moves = 0;

	movesElm.innerText = 0;
	timeElm.innerText = 0;


	that.icons.map(function(icon) { // 遍历卡片
		let card = new Card(icon);
		card.elm.addEventListener('click', function () { // 为卡片元素绑定点击事件

			// 修正下文异步时快速点击可能产生的 bug
			if (that.box.length == 2) {
				return false;
			}

			// 每点击一次卡牌增加一次移动次数
			that.addMoves();

			if (!game.state) {
				game.state = !game.state;
				game.calculateTime();
			}

			// 已匹配过的牌
			if (this.classList[1] == 'match') {
				console.log('已经匹配过的牌')
				return false;
			}

			// 重复点击同一张卡牌
			if (this.classList[1] == 'open') {
				console.log('重复点击同一张牌');
				return false;
			}

			card.open(); // 翻开卡片

			// 将卡片属性
			that.box.push(card.elm);
			
			// 如果翻牌数 < 2 则不进入匹配
			if (that.box.length < 2) {
				return false;
			}

			// 匹配
			let isMatched = that.match(); // 翻开的两张卡片是否匹配
			// let box = that.box;
			if (isMatched) {
				// 如果匹配
				console.log('匹配成功');
				card.show(that.box);
				game.matchedNum++;
				that.box = [];
			} else {
				// 如果不匹配
				console.log('匹配不成功');
				setTimeout(function () {
					card.close(that.box);
					that.box = [];
				}, 1000);
				
			}

			// 游戏胜利条件
			if (game.matchedNum == 2) {
				that.gameSuccess();
			}
		});

		// 添加 DOM
		that.deckElm.appendChild(card.elm);
	});
};

/**
 * @description  原型方法，用于游戏胜利时的游戏结算显示
 */ 
Game.prototype.gameSuccess = function () {
	// 游戏状态为停止
	game.state = false;

	// 显示游戏面板
	this.deckElm.classList.add('hide');
	scoreElm.classList.add('hide');
	successPanel.classList.remove('hide');

	// 显示游戏最终得分
	let movesResult = document.getElementsByClassName('moves')[1];
	movesResult.innerText = this.moves;
	let timeResult = document.getElementsByClassName('time')[1];
	timeResult.innerText = this.time;
}


/**
 * @description  原型方法，时间计算
 */ 
Game.prototype.calculateTime = function () {
	let that = this;
	let timer = setInterval(function () {
		if (!that.state) {
			clearInterval(timer);
			return false;
		}
		that.time++;
		timeElm.innerText = that.time;

		// 星级评定
		that.calculateStars();

	}, 1000);

};

/**
 * @description  原型方法，星级判定
 */ 
Game.prototype.calculateStars = function() {
	let starsElm = document.getElementsByClassName('stars');
	if (this.moves >= 30 && this.moves < 60) {
		this.stars = 2;
	} else if (this.moves >= 60) {
		this.stars = 1;
	}
	starsElm[0].innerHTML = '';
	starsElm[1].innerHTML = '';
	for (let i = 0; i < this.stars; i++) {
		for (let j = 0; j < starsElm.length; j++) {
			starsElm[j].innerHTML += '<li><i class="fa fa-star"></i></li> ';
		}
	}
};

/**
 * @description  步数计算
 */  
Game.prototype.addMoves = function () {
	this.moves++;
	movesElm.innerText = this.moves;

}

/**
 * @description  验证匹配
 * @return {bool} 返回匹配的正确与否
 */ 
Game.prototype.match = function() {
	if (this.box[0].childNodes[0].classList[1] == this.box[1].childNodes[0].classList[1]) {
		return true;
	}

	return false;
};

/**
 * @description 原型方法，用于重新开始游戏前清除卡片网页元素
 */
Game.prototype.repeat = function () {
	let items = deckElm.childNodes;
	// 移除旧游戏卡牌
	for (let i = 1; i < items.length; i++) {
		while (items.length > 1) {
			deckElm.removeChild(items[items.length - 1]);
		}
	}

	game.init();
};


let Card = function (icon) {
	this.icon = icon;
	this.elm = this.generateElm();

	// 更多实例变量
}

/**
 * @description 原型方法，用于生成卡片对应的网页元素
 * @returns {object} 卡片网页元素
 */
Card.prototype.generateElm = function() {
    var liElm = document.createElement('li');
    liElm.className = 'card';
    var iElm = document.createElement('i');
    iElm.className = `fa fa-${this.icon}`;
    liElm.appendChild(iElm);
    return liElm;
}

/**
 * @description 为卡片元素设置翻开卡片的 CSS 类
 */
Card.prototype.open = function() {
    this.elm.className = 'card open show';
}

/**
 * @description 为卡片元素设置匹配卡片的 CSS 类
 */
Card.prototype.show = function(box) {
	box[0].className = 'card match';
	box[1].className = 'card match';
};

/**
 * @description 为卡片元素设置关闭卡片的 CSS 类
 */
Card.prototype.close = function(box) {
	box[0].className = 'card';
	box[1].className = 'card';
}


// 初始数据
// 卡片数组
const icons = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube'];


// 卡片父级元素
let deckElm = document.getElementsByClassName('deck')[0];

// 事件元素
let timeElm = document.getElementsByClassName('time')[0];

// 重新开始游戏元素
let repeatElm = document.getElementsByClassName('fa-repeat')[0];

// 重新开始游戏 点击事件
repeatElm.addEventListener('click', function () {
	game.repeat();
});

// 移动次数元素
let movesElm = document.getElementsByClassName('moves')[0];

// 得分面板
let scoreElm = document.getElementsByClassName('score-panel')[0];

// 游戏胜利面板
let successPanel = document.getElementsByClassName('success-panel')[0];

let againElm = document.getElementsByClassName('again')[0];

// 为重玩绑定点击事件
againElm.addEventListener('click', function() {

	deckElm.classList.remove('hide');
	scoreElm.classList.remove('hide');
	successPanel.classList.add('hide');

	game.repeat();
});

// 创建游戏实例
let game = new Game(icons, deckElm);

// 首次初始化游戏
game.init();