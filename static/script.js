document.addEventListener("DOMContentLoaded", function () {
    const boardElement = document.getElementById("board");
    const newGameButton = document.getElementById("newGame");
    const resetButton = document.getElementById("reset");
    const hintButton = document.getElementById("hint");
    const checkErrorsButton = document.getElementById("checkErrors");
    const submitButton = document.getElementById("submit");
    const numberButtons = document.querySelectorAll(".number-btn");
    const difficultyButtons = document.querySelectorAll(".difficulty-btn");

    let selectedNumber = null;
    let boardData = [];
    let originalBoard = [];
    let errorCount = 0;

    // Ensure buttons exist before adding event listeners
    if (newGameButton) newGameButton.addEventListener("click", () => fetchNewGame());
    if (resetButton) resetButton.addEventListener("click", fetchReset);
    if (hintButton) hintButton.addEventListener("click", fetchHint);
    if (checkErrorsButton) checkErrorsButton.addEventListener("click", checkErrors);
    if (submitButton) submitButton.addEventListener("click", submitGame);

    function createBoard(data) {
        boardElement.innerHTML = "";
        boardData = JSON.parse(JSON.stringify(data));
        originalBoard = JSON.parse(JSON.stringify(data));

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let tile = document.createElement("div");
                tile.classList.add("tile");
                tile.dataset.row = i;
                tile.dataset.col = j;
                
                if (boardData[i][j] !== 0) {
                    tile.textContent = boardData[i][j];
                    tile.style.fontWeight = "bold";
                    tile.classList.add("prefilled");
                } else {
                    tile.addEventListener("click", function () {
                        if (selectedNumber && !tile.classList.contains("prefilled")) {
                            tile.textContent = selectedNumber;
                            boardData[i][j] = selectedNumber;
                        }
                    });
                }
                boardElement.appendChild(tile);
            }
        }
    }

    function fetchNewGame(difficulty = "medium") {
        fetch(`/new_game?difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => createBoard(data))
            .catch(error => console.error('Error fetching new game:', error));
    }

    function fetchReset() {
        createBoard(JSON.parse(JSON.stringify(originalBoard)));
        errorCount = 0;
    }

    function fetchHint() {
        console.log("Hint functionality not implemented yet");
    }

    function showPopup(message) {
        const popup = document.getElementById("popup-message");
        const popupText = document.getElementById("popup-text");
        const closeBtn = document.querySelector(".close-popup");
    
        popupText.textContent = message;
        popup.classList.add("show");
    
        // Close the popup when clicking the "X"
        closeBtn.addEventListener("click", function () {
            popup.classList.remove("show");
        });
    }
    
    function checkErrors() {
        let currentErrors = 0;
    
        for (let i = 0; i < 9; i++) {
            currentErrors += checkLine(boardData[i]);
            currentErrors += checkLine(getColumn(boardData, i));
        }
    
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                currentErrors += checkLine(getBox(boardData, boxRow, boxCol));
            }
        }
    
        errorCount += currentErrors;
        showPopup(`Number of errors: ${currentErrors} (Total errors: ${errorCount})`);
    }
    
    function submitGame() {
        if (isBoardComplete() && isBoardValid()) {
            showPopup("Hehehe You Won, Congratulations!");
        } else if (errorCount >= 20) {
            showPopup("Oopsie Daisy! You lost the game! Try again!");
        } else {
            showPopup("The Sudoku is not complete or valid yet! Keep trying!");
        }
    }
    

    function isBoardComplete() {
        return boardData.every(row => row.every(cell => cell !== 0));
    }

    function isBoardValid() {
        for (let i = 0; i < 9; i++) {
            if (checkLine(boardData[i]) > 0) return false;
            if (checkLine(getColumn(boardData, i)) > 0) return false;
        }
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                if (checkLine(getBox(boardData, boxRow, boxCol)) > 0) return false;
            }
        }
        return true;
    }

    function checkLine(line) {
        let seen = new Set();
        let errors = 0;
        for (let num of line) {
            if (num !== 0) {
                if (seen.has(num)) errors++;
                else seen.add(num);
            }
        }
        return errors;
    }

    function getColumn(board, col) {
        return board.map(row => row[col]);
    }

    function getBox(board, boxRow, boxCol) {
        let box = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                box.push(board[boxRow * 3 + i][boxCol * 3 + j]);
            }
        }
        return box;
    }

    // Start the game
    fetchNewGame();

});

