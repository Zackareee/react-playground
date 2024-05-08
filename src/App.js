import { useState } from 'react';

function Square({ value, onSquareClick }) {
    // console.log('clicked!');
    return <button onClick={onSquareClick} className="square">{value}</button>
}

function Board({ xIsNext, squares, onPlay, playSize }) {
    function handleClick(i) {
        if (squares[i] || calculateWinners(squares)) {
            return;
        }

        const nextSquares = squares.slice();
        console.log(squares)
        if (xIsNext) {nextSquares[i] = 'X'}
        else {nextSquares[i] = '0'}        
        onPlay(nextSquares)
    }
    

    const winner = calculateWinners(squares);
    let status;
    if (winner) {
        status = "winner: " + winner
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O")
    }
    // console.log(status)

    const board_size = playSize;
    const row_size = board_size;
    const col_size = board_size; //set up for debugging with various board sizes
    return <>
          <div className="status">{status}</div>
          {Array.from(Array(row_size).keys()).map(row => (
            <div className="board-row">
            {Array.from(Array(col_size).keys()).map(col => (
                <Square key={row * board_size + col} value={squares[row * board_size + col]} onSquareClick={() => handleClick(row * board_size + col)} />
            ))}
            </div>
          ))}
    </>;





















{/* 


          {[0, 1, 2, 3].map(row => (
            <div key={row} className="board-row">
              {[0, 1, 2, 3].map(col => {
                const index = row * 4 + col;
                return (
                  <Square
                    key={index}
                    value={squares[index]}
                    onSquareClick={() => handleClick(index)}
                  />
                );
              })}
            </div>
          ))}
        </>; */}
}





export function Game() {
    const [boardSize, setBoardSize] = useState(10);
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(boardSize**2).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext)
        // console.log(history)
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "go to move No." + move;
        } else { 
            description = "go to game start";
        }
        return (
            <li key={move}>
                <button onClick = {() => jumpTo(move)}>{description}</button>
            </li>
        )

    }) 


    return (
        <div className='game'>
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} playSize={boardSize}/>    
            </div>
            <div className='game-info'>
                <ol>{moves}</ol>
            </div>

        </div>
    ) 
}


function calculateWinners(squares) {
    const board_size = Math.sqrt(squares.length)
    for (let i = 0; i < board_size; i++){ //x coordinate, 1 - 10, left to right
        for (let j = 0; j < board_size; j++){ //y coordinate, 1 - 10, top down
            const current_coord = i * board_size + j; //current coordinate 1-100
            if (squares[current_coord] === null) { continue; }
            if (squares[current_coord] === squares[current_coord + board_size] && squares[current_coord] === squares[current_coord + (board_size*2)]) {// if current coordinate plus one below, plus two below
                console.log("found one", squares[current_coord])
                return squares[current_coord]
            }
            if (squares[current_coord] === squares[current_coord + 1] && squares[current_coord] === squares[current_coord + 2]) {// if current coordinate plus one right, plus two right
                console.log("found one", squares[current_coord])
                return squares[current_coord]
            }
            if (squares[current_coord] === squares[current_coord + board_size + 1] && squares[current_coord] === squares[current_coord + (board_size*2) + 2]) {// if current coordinate plus one down/right, plus two down/right
                console.log("found one", squares[current_coord])
                return squares[current_coord]
            }
            if (squares[current_coord] === squares[current_coord + board_size - 1] && squares[current_coord] === squares[current_coord + (board_size*2) - 2]) {// if current coordinate plus one down/left, plus two down/left
                console.log("found one", squares[current_coord])
                return squares[current_coord]
            }
        }
    }

    return null
}