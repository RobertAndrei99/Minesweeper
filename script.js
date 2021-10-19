let gameElements = [];
let nrBombs = 0;
let minesTxt = "Mines on game board : "
for (let i = 0; i < 80; i++) {
  gameElements.push(nrBombs);
}

for (let i = 0; i < 20; i++) {
  gameElements.push("bomb");
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
};
shuffle(gameElements);
let matrixGameElements = Array.from(Array(10), () => new Array(10));

function converToMatrix(array, matrix) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      matrix[i][j] = array[i * 10 + j];
    }
  }
}
converToMatrix(gameElements, matrixGameElements);

function checkingNeighbours(matrix, row, column) {
  let neighboursI = [1, 1, 1, 0, 0, -1, -1, -1];
  let neighboursY = [1, 0, -1, 1, -1, 1, 0, -1];
  let numberOfBombs = 0;
  for (let i = 0; i < 8; i++) {
    let indexOfI = row + neighboursI[i];
    let indexOfY = column + neighboursY[i];
    if (indexOfI < 0 || indexOfI > 9 || indexOfY < 0 || indexOfY > 9) {
      continue;
    }
    if (matrix[indexOfI][indexOfY] == "bomb") {
      ++numberOfBombs;
    }
  }
  return numberOfBombs;
}
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (matrixGameElements[i][j] != "bomb") {
      matrixGameElements[i][j] += checkingNeighbours(matrixGameElements, i, j);
    }
  }
}

let numberOfMines = 20;

function startGame() {
  document.getElementById('btnGameStart').style.display = "none";
  document.getElementById('numberMines').style.display = "block";
  for (let i = 0; i < 10; i++) {
    let column = 0;
    for (let j = i * 10; j < i * 10 + 10; j++) {
      $('#tableRow' + i).append(`
      <div id = "` + j + `" class = "tableCell" onmousedown="return choosenCell(` + j + ` , this)"> ` + matrixGameElements[i][column] + `</div>
      `)
        ++column;
    }
  }
  let tableBoard = document.getElementById('tableBoard').offsetWidth ;
  document.getElementById('numberMines').style.width = tableBoard - 52 + "px";
  $('#numberMines').append(`
 ` + numberOfMines + `
  `)
}

function revealNeighbours(id) {
  let neighboursI = [1, 1, 1, 0, 0, -1, -1, -1];
  let neighboursY = [1, 0, -1, 1, -1, 1, 0, -1];
  let row = id / 10;
  let column = id % 10;
  row = Math.floor(row);
  console.log(id + " " + row + " " + column);
  for (let i = 0; i < 8; i++) {
    let indexOfI = row + neighboursI[i];
    let indexOfY = column + neighboursY[i];
    if (indexOfI < 0 || indexOfI > 9 || indexOfY < 0 || indexOfY > 9) {
      continue;
    }
    let idToReveal = (indexOfI * 10) + indexOfY;
    document.getElementById(idToReveal).style.backgroundColor = "grey";
    document.getElementById(idToReveal).style.color = "black";
  }
}

function choosenCell(cellId, element) {
  if (event.button == 0) {
    document.getElementById(cellId).style.backgroundColor = "grey";
    document.getElementById(cellId).style.color = "black";
    if (document.getElementById(cellId).innerText == 0) {
      revealNeighbours(cellId);
    }
    if (document.getElementById(cellId).innerText == "bomb") {
      document.getElementById('tableBoard').style.pointerEvents = "none"
      let allClases = document.getElementsByClassName('tableCell');
      for (let i = 0; i < allClases.length; i++) {
        allClases[i].style.backgroundColor = "transparent";
        allClases[i].style.color = "black";
      }
    }
  } else if (event.button == 2) {
    document.addEventListener('contextmenu', event => event.preventDefault());
    if (numberOfMines > 0 && element.className == "tableCell") {
      if (element.className == "tableCell") {
        element.className = "auxClass";
        --numberOfMines;
        document.getElementById('numberMines').innerText = minesTxt + numberOfMines;
      }
    } else {
      if (element.className == "auxClass") {
        element.className = "tableCell";
        ++numberOfMines;
        document.getElementById('numberMines').innerText = minesTxt + numberOfMines;
      }
    }
  }
}
