const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll("[data-cell");

let circleTurn;
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageText = document.querySelector(
  "[data-winning-message-text]"
);
const restartButton = document.getElementById('restartButton');

startGame();

restartButton.addEventListener('click', startGame)

function startGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
      cell.classList.remove(X_CLASS)
      cell.classList.remove(CIRCLE_CLASS)
      cell.removeEventListener('click', handleClick)
    cell.addEventListener("click", handleClick, { once: true });
  })
  winningMessageElement.classList.remove("show")
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass); //place mark
  if (checkWin(currentClass)) {
    //check win
    endGame(false);
  } else if(isDraw()){
      endGame(true)
    }else {
  swapTurns();}
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}
function endGame(draw) {
  if (draw) {
      winningMessageText.innerText = "Draw!"
  } else {
    winningMessageText.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function checkWin(currentClass) {
  return winCombinations.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}




