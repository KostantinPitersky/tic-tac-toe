'use strict'

// игрок выбирает в "камень-ножницы-бумага" 1 - камень, 2 - ножнцы, 3 - бумага
function playerChoose(plResult) {
	if (plResult === 1) {
		plFirst = playersTurn(plResult);
		buttonP.hidden = false;
	} else if (plResult === 2) {
		plFirst = playersTurn(plResult);
		buttonP.hidden = false;
	} else if (plResult === 3) {
		plFirst = playersTurn(plResult);
		buttonP.hidden = false;
	}
}

// кто ходит первым? 1 - камень, 2 - ножнцы, 3 - бумага. true - первым ходит игрок, false - AI
function playersTurn(plResult) {
	chooseTable.hidden = true;
	rules.hidden = true;

	[plResultName, aiResultName] = [figures.get(plResult), figures.get(plResult)];
	while (plResultName.name !== aiResultName.weaker && aiResultName.name !== plResultName.weaker) {
		aiResultName = figures.get(Math.floor(1 + 3 * Math.random()));
	};

	chooseResult.hidden = false;
	chooseSign.hidden = false;
	plChoose[plResultName.id - 1].hidden = false;
	aiChoose[aiResultName.id - 1].hidden = false;

	if (plResultName.name === aiResultName.weaker) {
		chooseSign.innerHTML = 'Вы ходите первым!';
		return 1;
	} else if (aiResultName.name === plResultName.weaker) {
		chooseSign.innerHTML = 'Компьютер ходит первым!';
		return 0;
	} else {playersTurn(plResult)};
}
// скрываем крестики, нолики, ножницы, камни, бумагу
function hideCells() {
	for (i = 0; i < 3; i++) {
		for (j = 0; j < 3;j++) {
			cellX[i][j].hidden = true;
			cellO[i][j].hidden = true;
		}
	}
	for (i = 0; i < 3; i++) {
		plChoose[i].hidden = true;
		aiChoose[i].hidden = true;
	}
}

// ход AI
function aiTurn() {
	setTimeout( function() {
		[aiCellI, aiCellJ] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
		while ((plCells[aiCellI][aiCellJ] === 1) || (aiCells[aiCellI][aiCellJ] === 1)) {
			[aiCellI, aiCellJ] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
		};
		aiCheck = 1;
		// AI определяет, может ли выиграть следующим ходом
		for (k = 0; k < 3; k++) {
			for (m = 0; m < 3; m++) {
				if (aiCells[k][m] === 0 && plCells[k][m] === 0){
					aiCells[k][m] = 1;
					if ( endgameCheck(aiCells) ) {
						[aiCellI, aiCellJ] = [k, m];
						aiCheck = 0;
						break;
					} else {
						aiCells[k][m] = 0;
					}
				}
			}
		}
		// AI определяет, может ли не дать игроку выиграть
		if (aiCheck) {
			for (k = 0; k < 3; k++) {
				for (m = 0; m < 3; m++) {
					if (aiCells[k][m] === 0 && plCells[k][m] === 0){
						plCells[k][m] = 1;
						if ( endgameCheck(plCells) ) {
							[plCells[k][m], aiCellI, aiCellJ] = [0, k, m];
							break;
						} else {
							plCells[k][m] = 0;
						}
					}
				}
			}
		}
		aiCheck = 0;
		eval(`cell${aiCellI}${aiCellJ}${aiType}`).hidden = false;
		aiCells[aiCellI][aiCellJ] = 1;
		plFirst = 1;
		count++;
		turnP.innerHTML = 'Ход игрока';
		tttTable.classList.remove('hideEvents');
		endgameCheck(aiCells);
	}, 1100);
}

//ход игрока
function plTurn(cell) {
	eval(cell + plType).hidden = false;
	plCells[k][m] = 1;
	plFirst = 0;
	count++;
	turnP.innerHTML = 'Ход компьютера';
	endgameCheck(plCells);
};

// начинаем новую игру
function gameStart() {
	buttonP.hidden = true;
	chooseResult.hidden = true;
	tttTable.hidden = false;
	scoreTable.hidden = false;
	turnTable.hidden = false;
	if (plFirst === 1) {
		plType = 'X';
		aiType = 'O';
		turnP.innerHTML = 'Ход игрока';
		tttTable.classList.remove('hideEvents');

	} else {
		plType = 'O';
		aiType = 'X';
		turnP.innerHTML = 'Ход компьютера';
		aiTurn();
	};
}

// перезагрузка игры
function gameReset() {
	tttTable.hidden = true;
	scoreTable.hidden = true;
	chooseResult.hidden = true;
	buttonP.hidden = true;
	buttonNewP.hidden = true;
	turnTable.hidden = true;
	gameTitle.hidden = false;
	chooseTable.hidden = false;
	rules.hidden = false;
	turnP.innerHTML = '';
	tttTable.classList.add('hideEvents');
	hideCells();
	for (i = 0; i < 3; i++) {
		for (j = 0; j < 3; j++){
			plCells[i][j] = 0;
			aiCells[i][j] = 0;
		}
		count = 0;
	}
}

// проверка на окончание игры
function endgameCheck(gameCells) {
	//проверка по вертикали и горизонтали
	for (i = 0; i < 3; i++) {
		for (j = 0; j < 3; j++) {
			if (!gameCells[i][j]) {
				break;
			} else if (j === (gameCells.length - 1)){
				if (aiCheck) {
					return 1;
				} else {
					endgame(gameCells);
					return;
				}
			} 
		}
		for (j = 0; j < 3; j++) {
			if (!gameCells[j][i]) {
				break;
			} else if (j === (gameCells.length - 1)){
				if (aiCheck) {
					return 1;
				} else {
					endgame(gameCells);
					return;
				}
			} 
		}
	}
	//проверка по диагонали
	for (i = 0; i < 3; i++) {
		if (!gameCells[i][i]) {
			break;
		} else if (i === (gameCells.length - 1)){
			if (aiCheck) {
					return 1;
				} else {
					endgame(gameCells);
					return;
				}
		}
	}
	//проверка по обратной диагонали
	for (i = 0; i < 3; i++) {
		j = gameCells.length - 1 - i;
		if (!gameCells[i][j]) {
			break;
		} else if (i === (gameCells.length - 1)){
			if (aiCheck) {
					return 1;
				} else {
					endgame(gameCells);
					return;
				}
		}
	}
	if (count === 9) {
		endgame('draw');
	}
	if (aiCheck) return 0;
	if (plFirst === 0) aiTurn();
}

//конец игры
function endgame(condition) {
	if (condition === plCells) {
		turnP.innerHTML = 'Вы победили!';
		plCount++;
		scoreP.innerHTML = `${plName}: ${plCount} — Компьютер: ${aiCount}`;
	} else if (condition === aiCells) {
		turnP.innerHTML = 'Вы проиграли...';
		aiCount++;
		scoreP.innerHTML = `${plName}: ${plCount} — Компьютер: ${aiCount}`;
	} else if  (condition === 'draw') {
		turnP.innerHTML = 'Ничья';
	}
	plFirst = 1;
	tttTable.classList.add('hideEvents');
	setTimeout(function () {buttonNewP.hidden = false}, 1000);
}

let aiCheck,													// маркер проверки AI на возможность выиграть
	aiResultName,												// имя фигуры, выбранной AI из коллекции figures
	aiType,														// AI с крестиками или ноликами
	figure,														// фигура из коллекции figures
	i, j, k, m,													// каунтеры для циклов
	plFirst,													// очередь игрока
	plResult,													// выбор игрока в "камень-ножницы-бумага"
	plResultName,												// имя фигуры, выбранной игроком из коллекции figures
	plType;														// игрок с крестиками или ноликами

let aiCount = 0;												// счетчик побед AI
let count = 0;													// счетчик ходов общий
let plCount = 0;												// счетчик побед игрока
let figures = new Map();										// коллекция для "камень-ножницы-бумага"
let aiCellI = 0;												// номер клетки, выбранной AI
let aiCellJ = 0;												// номер клетки, выбранной AI

let buttonNewP = document.getElementById('buttonNewP');			// кнопка новой игры
let buttonP = document.getElementById('buttonP');				// кнопка начала игры
let chooseResult = document.getElementById(`chooseResult`);		// графический результат "камень-ножницы-бумага"
let chooseSign = document.getElementById('chooseSign');			// текстовый результат "камень-ножницы-бумага"
let chooseTable = document.getElementById(`chooseTable`);		// графический выбор "камень-ножницы-бумага"
let gameTitle = document.getElementById(`gameTitle`);			// заголово игры
let rules = document.getElementById('rules');					// правила
let scoreTable = document.getElementById('scoreTable');			// таблица счета
let scoreP = document.getElementById('scoreP');					// текстовая часть счета
let turnTable = document.getElementById('turnTable');			// таблица очередности хода и результата игры
let turnP = document.getElementById('turnP');					// текстовая часть очередности хода и результата игры
let tttDiv = document.getElementById('tttDiv');					// div таблицы крестиков ноликов
let overlay = document.querySelector('.overlay');				// оверлей для старта игры

// массивы маркеров учета выбора клетки...
let [plCells, aiCells] = [new Array(3), new Array(3)];
for (i = 0; i < 3; i++) {
	plCells[i] = new Array(3);		// ...игроком
	aiCells[i] = new Array(3);		// ....AI
}

// графическое оформление выбора в "камень-ножницы-бумага"...
let plChoose = new Array(3); 	//... для игрока
let aiChoose = new Array(3); 	//... для AI
for (i = 0; i < 3; i++) {
	plChoose[i] = document.getElementById(`plChoose${i+1}`);
	aiChoose[i] = document.getElementById(`aiChoose${i+1}`);
}

// создаем таблицу крестиков ноликов
let tttTable = document.createElement('table');
tttDiv.append(tttTable);
tttTable.id = "tttTable";
for (i = 0; i < 3; i++) {
	let tr = document.createElement('tr');
	tttTable.append(tr);
	for (j = 0; j < 3; j++) {
		let td = document.createElement('td');
		tr.append(td);
		td.classList.add("tttTableTd");
		td.id = `cell${i}${j}`;
		let imgO = document.createElement('img');
		let imgX = document.createElement('img');
		td.append(imgO);
		td.append(imgX);
		imgO.src = "img/O.png";
		imgX.src = "img/X.png";
		imgO.id = `cell${i}${j}O`;
		imgX.id = `cell${i}${j}X`;
	}
}

//смена курсора на свободных клетках
tttTable.onmouseover = (event) => {
	if (event.target.id.slice(0,4) === "cell") {
		k = event.target.id.slice(4, 5);
		m = event.target.id.slice(5, 6);
		if (!plCells[k][m] && !aiCells[k][m]) {
			event.target.classList.add("cursorMouse")
		} else {
			event.target.classList.remove("cursorMouse")
		}
	}
}

//событие onclick на всю таблицу с выбором клетки
tttTable.onclick = (event) => {
	if (plCells[k][m] || aiCells[k][m]) {
		return;
	}
	if (!plCells[k][m] && !aiCells[k][m]) {
		plTurn(event.target.id);
	}
	tttTable.classList.add('hideEvents');
}

// графическое оформление Х и О
let cellX = [];
let cellO = [];
for (i = 0; i < 3; i++) {
	cellX.push([]);
	cellO.push([]);
	for(j = 0; j < 3; j++) {
		cellX[i][j] = document.getElementById(`cell${i}${j}X`);
		cellO[i][j] = document.getElementById(`cell${i}${j}O`);
	}
}

// настраиваем игрока
let plName = prompt('Как к вам обращаться?','');
if (plName.length > 10) {
	plName = prompt('Имя игрока не может быть больше 10 символов. Пожалуйста, повторите ввод','');
};
if (plName === null || plName === '') plName = "Игрок №1";
alert(`Добро пожаловать в крестики-нолики, ${plName}!`);

// задаём начальный счёт
scoreP.innerHTML = `${plName}: ${plCount} — Компьютер: ${aiCount}`;

//коллекция фигур для "камень-ножницы-бумага"
figures.set(1, {
		name: 'paper',
		id: 1,
		weaker: 'scissors',
		stronger: 'stone',
		immune: 'paper'})
	.set(2, {
		name: 'stone',
		id: 2,
		weaker: 'paper',
		stronger: 'scissors',
		immune: 'paper'})
	.set(3, {
		name: 'scissors',
		id: 3,
		weaker: 'stone',
		stronger: 'paper',
		immune: 'scisssors'})

gameReset()
overlay.hidden = true;