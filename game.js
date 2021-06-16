var currentGame;
  var newAi;
  var playerX = 1;
  var playerXWin = "1,1,1";
  var playerO = 2;
  var playerOWin = "2,2,2";
  var winCombo;


  //---Game class---//

  var Game = function(ai, aiWin, human, humanWin) {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    //game board
    this.winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]; 
    // indicies of winning positions
    this.status = "active";
    this.ai = ai; // ai can be 1 or 2
    this.aiWinCombo = aiWin; // "1,1,1" or "2,2,2";
    this.human = human; // human can be 1 or 2    
    this.humanWinCombo = humanWin;
  };

  Game.prototype.setValue = function(x, y, player) { 
    //places a number on the board
    this.board[x][y] = player; // make a move
  };

  Game.prototype.checkVictory = function() { //checks for victory
    var flattened = this.board.reduce(function(a, b) { //flattens board
      return a.concat(b);
    });
    var combo = this.winConditions;
    var tieCounter = 0;
    for (var i = 0; i < combo.length; i++) {
      var toTest = [];
      for (var j = 0; j < combo[i].length; j++) {
        toTest.push(flattened[combo[i][j]]); //makes array of numbers using indicies from win conditions
      }
      if (toTest.toString() === this.aiWinCombo) { //checks for win
        this.status = "ai";
        winCombo = combo[i];
      } else if (toTest.toString() === this.humanWinCombo) {
        this.status = "human";
        winCombo = combo[i];
      } else if (toTest.indexOf(0) === -1) {
        tieCounter++;
      }
    }
    if (this.status === "active" && tieCounter === combo.length) { //tie condition
      this.status = "tie";
    }
  };

  Game.prototype.updateButtons = function() { // puts x's and o's on the board
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.board[i][j] === 1) {
          drawX(i, j);
        }
        if (this.board[i][j] === 2) {
          drawO(i, j);
        }
      }
    }
  };

  Game.prototype.highlightCells = function() {
    var toHighlight = [];
    for (var i = 0; i < winCombo.length; i++) {
      // Get winning cells coordinates;
      if (winCombo[i] <= 2) {
        toHighlight.push([0, winCombo[i]]);
      } else if (winCombo[i] <= 5) {
        toHighlight.push([1, winCombo[i] - 3]);
      } else if (winCombo[i] <= 8) {
        toHighlight.push([2, winCombo[i] - 6])
      }
    }
    for (var j = 0; j < toHighlight.length; j++) {
      var c = toHighlight[j];
      document.getElementById(c[0]+ "" + c[1]).style.backgroundColor = "#990000";
    }
  }

  Game.prototype.displayWin = function() {
    if (this.status === "ai") {
      $("#status").html("AI won!");
      this.highlightCells();
    }
    if (this.status === "human") {
      $("#status").html("You won!");
      this.highlightCells();
    }
    if (this.status === "tie") {
      $("#status").html("It's a tie!");
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          document.getElementById(i + "" + j).style.backgroundColor = "#990000";
        }
      }
    }
  };

  var Ai = function() {
    this.level = "optimal";
  };

  Ai.prototype.firstMove = function(player) { 
    // when AI goes first it makes a random perfect move to speed things up
    var perfectMoves = [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2]
    ];
    var randomChoice = Math.floor(Math.random() * 4);
    var randomMove = perfectMoves[randomChoice];
    currentGame.setValue(randomMove[0], randomMove[1], player);
    currentGame.updateButtons();
  };

  //Minimax algorithm//
  var scoreModifier = 0;

  Ai.prototype.findBestMove = function(player) {
    currentGame.checkVictory();
    if (currentGame.status === "ai") {
      return [10, currentGame.board]; // Score is the element with index 0 in the array of boards/scores
    } else if (currentGame.status === "human") {
      return [-10, currentGame.board];
    } else if (currentGame.status === "tie") {
      return [0, currentGame.board];
    } else {

      var nextScore;
      var nextBoard;
      var score;

      var updateState = function() {
        nextBoard = currentGame.board.map(function(arr) {
          return arr.slice();
        });
        nextScore = score;
      };

      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (currentGame.board[i][j] === 0) {
            currentGame.setValue(i, j, player);
            scoreModifier++;
            if (player === currentGame.ai) {
              score = this.findBestMove(currentGame.human)[0] - scoreModifier;
              if (score > nextScore || !nextScore) {
                updateState();
              }
            } else {
              score = this.findBestMove(currentGame.ai)[0] + scoreModifier;
              if (score < nextScore || !nextScore) {
                updateState();
              }
            }
            currentGame.setValue(i, j, 0);
            currentGame.status = "active";
            scoreModifier = 0;
          }
        }
      }
      return [nextScore, nextBoard];
    }
  };

  //Minimax ends here//

  Ai.prototype.makeAMove = function() {
    var optimalBoard = this.findBestMove(currentGame.ai);
    currentGame.board = optimalBoard[1]; //[0] is score of the board, [1] is the board itself
    currentGame.updateButtons();
    currentGame.checkVictory();
    if (currentGame.status !== "active") {
      currentGame.displayWin();
    }
    $(".cell").on("click", humanMove);
  };
  
  //This draws X's and O's///

  function drawO(x, y) {
    var c = document.getElementById(x + "" + y);
    var ctx = c.getContext("2d");
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(40, 40, 25, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function drawX(x, y) {
    var c = document.getElementById(x + "" + y);
    var ctx = c.getContext("2d");
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";

    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(60, 60);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 60);
    ctx.lineTo(60, 20);
    ctx.stroke();
  }
  
  //Clears board for new game//

  function clearBoard() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var c = document.getElementById(i + "" + j);
        c.style.backgroundColor = "#009933";
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 80, 80);
      }
    }
  }
  
  //Cell functionality//
  
  function humanMove() {
    var x = this.id.charAt(0);
    var y = this.id.charAt(1);
    if (currentGame.board[x][y] === 0) {
      currentGame.setValue(x, y, currentGame.human);
      currentGame.updateButtons();
      function move() {
        newAi.makeAMove();
      }
      setTimeout(move, 10);
      $(".cell").off("click");
    }
  };
  
  //On click events//

$(document).ready(function() {
  
  

  $("#playO").click(function() {
    clearBoard();
    currentGame = new Game(playerX, playerXWin, playerO, playerOWin);
    newAi = new Ai();
    currentGame.updateButtons();
    newAi.firstMove(currentGame.ai);
    $("#status").html("Your turn"); 
    $(".cell").on("click", humanMove);
    currentGame.highlight();
  });

  $("#playX").click(function() {
    clearBoard();
    currentGame = new Game(playerO, playerOWin, playerX, playerXWin);
    newAi = new Ai();
    currentGame.updateButtons();
    $("#status").html("Your turn");
    $(".cell").on("click", humanMove);
  });

  $(".cell").click(humanMove);

});
