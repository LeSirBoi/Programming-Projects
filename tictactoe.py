import random

theBoard = {'top-L': ' ', 'top-M': ' ', 'top-R': ' ', 'mid-L': ' ', 'mid-M': ' ', 'mid-R': ' ', 'bottom-L': ' ', 'bottom-M': ' ', 'bottom-R': ' '}

# prints the tic-tac-toe board
def printBoard(board):
    print(board['top-L'] + '|' + board['top-M'] + '|' + board['top-R'])
    print('-----')
    print(board['mid-L'] + '|' + board['mid-M'] + '|' + board['mid-R'])
    print('-----')
    print(board['bottom-L'] + '|' + board['bottom-M'] + '|' + board['bottom-R'])

# player can choose a letter to play in the board
def pickLetter():
    letter = ''
    while letter != 'O' and letter != 'X':
        print('Choose a letter between \'O\' and \'X\'')
        letter = input().upper()
    print('Player picks ' + letter)
    return ['O', 'X'] if letter == 'O' else ['X', 'O']

# randomly determines who plays first
def whoGoesFirst():
    if random.randint(0, 1) == 0:
        return 'computer'
    else:
        return 'player'

# puts the assigned letter in the specified square
def makeMove(board, square, letter):
    board[square] = letter
    printBoard(board)

# player's turn
def playerMove():
    print('Select a square to fill (top-, mid-, bottom- & L, M, R): ')
    printBoard(theBoard)
    square = input()
    while theBoard[square] != ' ':
        print('Select a square to fill (top-, mid-, bottom- & L, M, R): ')
        printBoard(theBoard)
        square = input()
    makeMove(theBoard, square, playerLetter)

# computer's turn
def computerMove():
    square, value = random.choice(list(theBoard.items()))
    while value != ' ':
        square, value = random.choice(list(theBoard.items()))
    print('Computer picks ' + square)
    makeMove(theBoard, square, computerLetter)

# checks if there are squares left in the board
def isBoardFull(board):
    return all(value != ' ' for value in board.values())

# checks if there is a winner in the game
def isWinner(board, letter):
    if board['top-L'] == letter:
        if board['top-M'] == letter and board['top-R'] == letter:
            return True
        elif board['mid-M'] == letter and board['bottom-R'] == letter:
            return True
        elif board['mid-L'] == letter and board['bottom-L'] == letter:
            return True
    elif board['bottom-R'] == letter:
        if board['bottom-M'] == letter and board['bottom-L'] == letter:
            return True
        elif board['mid-M'] == letter and board['top-L'] == letter:
            return letter
        elif board['mid-R'] == letter and board['top-R'] == letter:
            return True
    return False

response = 'Y'

# run the game
while response == 'Y':
    theBoard = {'top-L': ' ', 'top-M': ' ', 'top-R': ' ', 'mid-L': ' ', 'mid-M': ' ', 'mid-R': ' ', 'bottom-L': ' ', 'bottom-M': ' ', 'bottom-R': ' '}
    print('Welcome to tic-tac-toe!')
    playerLetter, computerLetter = pickLetter()
    turn = whoGoesFirst()
    print('The ' + turn + ' will go first.')
    while not isBoardFull(theBoard):
        if turn == 'computer':
            computerMove()
            if isWinner(theBoard, computerLetter):
                print('You lose!')
                break
            turn = 'player'
        else:
            playerMove()
            if isWinner(theBoard, playerLetter):
                print('You win!')
                break
            turn = 'computer'
    if isBoardFull(theBoard):
        print('Board is full, tie!')
    print('Do you want to play again? Y/N: ')
    response = input().upper()