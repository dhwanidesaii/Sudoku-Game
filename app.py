from flask import Flask, render_template, jsonify, request, redirect, url_for
import random  # FIX: Import missing random module

app = Flask(__name__)

def generate_sudoku(difficulty="medium"):
    board = [[0] * 9 for _ in range(9)]
    filled_positions = set()

    if difficulty == "easy":
        num_filled = 40
    elif difficulty == "hard":
        num_filled = 20
    else:  # medium
        num_filled = 30

    while len(filled_positions) < num_filled:
        row = random.randint(0, 8)
        col = random.randint(0, 8)
        if (row, col) not in filled_positions:
            num = random.randint(1, 9)
            if is_safe(board, row, col, num):
                board[row][col] = num
                filled_positions.add((row, col))

    return board

def is_safe(board, row, col, num):
    # Check row
    for x in range(9):
        if board[row][x] == num:
            return False

    # Check column
    for x in range(9):
        if board[x][col] == num:
            return False

    # Check 3x3 box
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False

    return True

@app.route('/')
def index():
    return render_template('sudoku.html')

@app.route('/new_game')
def new_game():
    difficulty = request.args.get('difficulty', 'medium')
    sudoku_board = generate_sudoku(difficulty)
    return jsonify(sudoku_board)

@app.route('/submit', methods=['POST'])
def submit():
    return redirect(url_for('result', status='pending'))

@app.route('/result/<status>')
def result(status):
    if status == 'win':
        message = "Hehe, Congratulations. You Won!"
    elif status == 'lose':
        message = "Oopsie Daisy, Better Luck Next Time!"
    else:
        message = "Something went wrong!"
    return render_template('win_lose.html', message=message)

if __name__ == '__main__':
    app.run(debug=True)
