const gameBoard = (() => {

  const _board = new Array(9);

  const cells = [...document.querySelectorAll("[data-cell]")];

  const getField = (num) => _board[num];
  
  const clear = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = undefined;
    }
  };

  const setField = (num, player) => {
    htmlField = cells[num];
    htmlField.classList.add(player.getSign());
    _board[num] = player.getSign();
  };

  const setFieldForAi = (num, player) => {
    if (player == undefined) {
      _board[num] = undefined;
      return;
    }
    _board[num] = player.getSign();
  };

  const getEmptyFieldsIndex = () => {
    fields = [];
    for (let i = 0; i < _board.length; i++) {
      const field = _board[i];
      if (field == undefined) {
        fields.push(i);
      }
    }
    return fields;
  };
  return {
    cells,
    clear,
    getField,
    setField,
    setFieldForAi,
    getEmptyFieldsIndex,
  };
})();

const Player = (sign) => {
  let _sign = sign;
  const getSign = () => _sign;
  return {
    getSign,
  };
};

const minimaxAi = ((percentage) => {
  let aiPrecision = percentage;

  const setAiPercentage = (percentage) => {
    aiPrecision = percentage;
  };
  const getAiPercentage = () => {
    return aiPrecision;
  };

  const chooseField = () => {

    const value = Math.floor(Math.random() * (100 + 1));

    let choice = null;
    if (value <= aiPrecision) {
      choice = minimax(gameBoard, gameController.getAiPlayer()).index;
      const field = gameBoard.getField(choice);
    } else {
      const emptyFieldsIndex = gameBoard.getEmptyFieldsIndex();
      let randomMove = Math.floor(Math.random() * emptyFieldsIndex.length);
      choice = emptyFieldsIndex[randomMove];
    }
    return choice;
  };

  const findBestMove = (moves, player) => {
    let bestMove;
    if (player === gameController.getAiPlayer()) {
      let bestScore = -1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };

  const minimax = (newBoard, player) => {
    let empty = newBoard.getEmptyFieldsIndex();

    if (gameController.checkDraw(newBoard)) {
      return {
        score: 0,
      };
    } else if (gameController.checkWin(newBoard)) {
      if (player.getSign() == gameController.getPlayerOne().getSign()) {
        return {
          score: 10,
        };
      } else if (player.getSign() == gameController.getAiPlayer().getSign()) {
        return {
          score: -10,
        };
      }
    }

    let moves = [];

    for (let i = 0; i < empty.length; i++) {
      let move = {};
      move.index = empty[i];

      newBoard.setFieldForAi(empty[i], player);

      if (player.getSign() == gameController.getAiPlayer().getSign()) {
        let result = minimax(newBoard, gameController.getPlayerOne());
        move.score = result.score;
      } else {
        let result = minimax(newBoard, gameController.getAiPlayer());
        move.score = result.score;
      }

      newBoard.setFieldForAi(empty[i], undefined);

      moves.push(move);
    }

    return findBestMove(moves, player);
  };
  return {
    minimax,
    chooseField,
    getAiPercentage,
    setAiPercentage,
  };
})(0);

const gameController = (() => {
  const _playerOne = Player("x");
  const _playerTwo = Player("circle");
  const _aiPlayer = Player("circle");

  const _aiLogic = minimaxAi;

  const getPlayerOne = () => _playerOne;
  const getAiPlayer = () => _aiPlayer;

  const _sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  let circleTurn;
  let vsAi;

  const winningMessageElement = document.getElementById("winningMessage");
  const winningMessageText = document.querySelector(
    "[data-winning-message-text]"
  );

  const setOpponent = (value) => {
    if (value == "player") {
      vsAi = false;
    } else {
      vsAi = true;
    }
  };

  const playerStep = (num) => {
    const field = gameBoard.getField(num);
    if (field == undefined) {
      if (!circleTurn) {
        gameBoard.setField(num, _playerOne);
        if (checkWin(gameBoard)) {
          endGame(false);
        } else if (checkDraw(gameBoard)) {
          endGame(true);
        } else {
          if (!vsAi) {
            swapTurns();
          } else {
            swapTurns();
            aiStep();
          }
        }
      } else if (circleTurn && !vsAi) {
        gameBoard.setField(num, _playerTwo);
        if (checkWin(gameBoard)) {
          endGame(false);
        } else if (checkDraw(gameBoard)) {
          endGame(true);
        } else {
          swapTurns();
        }
      }
    }
  };

  const aiStep = () => {
    (async () => {
      await _sleep(200 + Math.random() * 200);
      const num = _aiLogic.chooseField();
      gameBoard.setField(num, _aiPlayer);
      if (checkWin(gameBoard)) {
        endGame(false);
      } else if (checkDraw(gameBoard)) {
        endGame(true);
      } else {
        swapTurns();
      }
    })();
  };

  const swapTurns = () => {
    circleTurn = !circleTurn;
  };

  const restart = () => {
    circleTurn = false;
    gameBoard.clear();
    displayController.clear();
    winningMessageElement.classList.remove("show");
  };

  const checkDraw = (board) => {
    if (checkWin(board)) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      const field = board.getField(i);
      if (field == undefined) {
        return false;
      }
    }
    return true;
  };

  const _checkForRows = (board) => {
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = i * 3; j < i * 3 + 3; j++) {
        row.push(board.getField(j));
      }

      if (
        row.every((field) => field == "x") ||
        row.every((field) => field == "circle")
      ) {
        return true;
      }
    }
    return false;
  };

  const _checkForColumns = (board) => {
    for (let i = 0; i < 3; i++) {
      let column = [];
      for (let j = 0; j < 3; j++) {
        column.push(board.getField(i + 3 * j));
      }

      if (
        column.every((field) => field == "x") ||
        column.every((field) => field == "circle")
      ) {
        return true;
      }
    }
    return false;
  };

  const _checkForDiagonals = (board) => {
    diagonal1 = [board.getField(0), board.getField(4), board.getField(8)];
    diagonal2 = [board.getField(6), board.getField(4), board.getField(2)];
    if (
      diagonal1.every((field) => field == "x") ||
      diagonal1.every((field) => field == "circle")
    ) {
      return true;
    } else if (
      diagonal2.every((field) => field == "x") ||
      diagonal2.every((field) => field == "circle")
    ) {
      return true;
    }
  };

  const checkWin = (board) => {
    if (
      _checkForRows(board) ||
      _checkForColumns(board) ||
      _checkForDiagonals(board)
    ) {
      return true;
    }
    return false;
  };

  function endGame(draw) {
    if (draw) {
      winningMessageText.innerText = "Draw!";
    } else {
      winningMessageText.innerText = `${circleTurn ? "O's" : "X's"} Win!`;
    }
    winningMessageElement.classList.add("show");
  }

  return {
    playerStep,
    restart,
    setOpponent,
    getAiPlayer,
    getPlayerOne,
    checkDraw,
    checkWin,
  };
})();

const displayController = (() => {
  const restartButton = document.getElementById("restartButton");
  const htmlBoard = Array.from(document.querySelectorAll("[data-cell"));
  const form = document.querySelector(".form");
  const X_CLASS = "x";
  const CIRCLE_CLASS = "circle";

  const _changeOpponent = () => {
    const level = document.getElementsByName("levels");
    let value;
    for (var i = 0; i < level.length; i++) {
      if (level[i].checked) {
        value = level[i].value;
      }
    }
    switch (value) {
      case "player":
        gameController.setOpponent("player");
        break;
      case "easy":
        gameController.setOpponent("ai");
        minimaxAi.setAiPercentage(20);
        break;
      case "medium":
        gameController.setOpponent("ai");
        minimaxAi.setAiPercentage(70);
        break;
      case "hard":
        gameController.setOpponent("ai");
        minimaxAi.setAiPercentage(90);
        break;
      case "unbeatable":
        gameController.setOpponent("ai");
        minimaxAi.setAiPercentage(100);
        break;
    }

    gameController.restart();
  };

  const clear = () => {
    gameBoard.cells.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
    });
  };

  const _boardEventListners = () => {
    for (let i = 0; i < htmlBoard.length; i++) {
      field = htmlBoard[i];
      field.addEventListener("click", gameController.playerStep.bind(field, i));
    }
  };

  const _init = (() => {
    _boardEventListners();
    restartButton.addEventListener("click", gameController.restart);
    form.addEventListener("change", _changeOpponent);
  })();

  return {
    clear,
  };
})();
