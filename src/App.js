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
    const win_length = 5
    const board_size = Math.sqrt(squares.length)
    for (let row = 0; row < board_size; row++){ //x coordinate, 1 - 10, left to right
        for (let col = 0; col < board_size; col++){ //y coordinate, 1 - 10, top down
            const current_coord = row * board_size + col; //current coordinate 1-100
            let current_length = 1;
            let previous_cell = null;
            if (squares[current_coord] === null) { continue; }
            if (col < (board_size - win_length + 1)) {
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one to the right, plus one more to the right ... win_length
                    if (squares[current_coord+i] !== null && previous_cell === squares[current_coord+i]) {
                        console.log(current_coord+i,squares[current_coord+i])
                        current_length++
                        console.log(current_length, squares[current_coord+i])
                    }
                    else {
                        previous_cell = squares[current_coord+i];
                        current_length = 1;
                    }
                    if (win_length <= current_length) {
                        return squares[current_coord]
                    }
                }
            }
            if (row < (board_size - win_length + 1)) {
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one to the right, plus one more to the right ... win_length
                    if (squares[current_coord + ( i * 10 )] !== null && previous_cell === squares[current_coord + ( i * 10 )]) {
                        console.log(current_coord + ( i * 10 ),squares[current_coord + ( i * 10 )])
                        current_length++
                        console.log(current_length, squares[current_coord + ( i * 10 )])
                    }
                    else {
                        previous_cell = squares[current_coord + ( i * 10 )];
                        current_length = 1;
                    }
                    if (win_length <= current_length) {
                        return squares[current_coord]
                    }
                }
            }

            if (row < (board_size - win_length + 1) && col < (board_size - win_length + 1) ) { //TODO check this is correct bounds
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one to the right, plus one more to the right ... win_length
                    if (squares[current_coord + ( i * 10  )+ i] !== null && previous_cell === squares[current_coord + ( i * 10  )+ i]) {
                        console.log(current_coord + ( i * 10 + i ),squares[current_coord + ( i * 10) + i ])
                        current_length++
                        console.log(current_length, squares[current_coord + ( i * 10 ) + i])
                    }
                    else {
                        previous_cell = squares[current_coord + ( i * 10 ) + i];
                        current_length = 1;
                    }
                    if (win_length <= current_length) {
                        return squares[current_coord]
                    }
                }
            }

            if (row < (board_size - win_length + 1) && col > (win_length - 2) ) { //TODO check this is correct bounds
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one to the right, plus one more to the right ... win_length
                    if (squares[current_coord + ( i * 10  )- i] !== null && previous_cell === squares[current_coord + ( i * 10  )- i]) {
                        console.log(current_coord + ( i * 10 - i ),squares[current_coord + ( i * 10) - i ])
                        current_length++
                        console.log(current_length, squares[current_coord + ( i * 10 ) -i])
                    }
                    else {
                        previous_cell = squares[current_coord + ( i * 10 ) - i];
                        current_length = 1;
                    }
                    if (win_length <= current_length) {
                        return squares[current_coord]
                    }
                }
            }
        }
    }
    return null
}