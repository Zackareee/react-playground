import { useState } from 'react';

function Square({ value, onSquareClick }) {
    // console.log('clicked!');
    return <button onClick={onSquareClick} className="square">{value}</button>
}

function Board({ xIsNext, squares, onPlay, playSize, winSize}) {
    function handleClick(i) {
        if (squares[i] || calculateWinners(squares, winSize)) {
            return;
        }

        const nextSquares = squares.slice();
        console.log(squares)
        if (xIsNext) {nextSquares[i] = 'X'}
        else {nextSquares[i] = '0'}        
        onPlay(nextSquares)
    }
    

    const winner = calculateWinners(squares, winSize);
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
    const [boardSize, setBoardSize] = useState(3);
    const [winLength, setwinLength] = useState(3);
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

    const setWidth = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target)
        const inputValue = formData.get('width')
        console.log(inputValue)
        setBoardSize(parseInt(inputValue))
        setHistory([Array(boardSize**2).fill(null)])
        setCurrentMove(0)
        setXIsNext(true)
    }
    const setWinLength = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target)
        const inputValue = formData.get('winlength')
        console.log(inputValue)
        setwinLength(parseInt(inputValue))
        setHistory([Array(boardSize**2).fill(null)])
        setCurrentMove(0)
        setXIsNext(true)
    }

    return (
        <>
            <form onSubmit={setWidth}>
                Board Width: <input defaultValue="3"  name="width" />
                <button type="submit">Search</button>
            </form>
            <form onSubmit={setWinLength}>
                Win Length: <input defaultValue="3" name="winlength" />
                <button type="submit">Search</button>
            </form>

            <div className='game'>
                <div className='game-board'>
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} playSize={boardSize} winSize={winLength} />    
                </div>
                <div className='game-info'>
                    <ol>{moves}</ol>
                </div>

            </div>
        </>
    ) 
}



function calculateWinners(squares, winSize) {
    let run_length = 0;
    const win_length = winSize
    const board_size = Math.sqrt(squares.length)
    for (let row = 0; row < board_size; row++){ //x coordinate, 1 - 10, left to right
        for (let col = 0; col < board_size; col++){ //y coordinate, 1 - 10, top down
            run_length++
            const current_coord = row * board_size + col; //current coordinate 1-100
            let current_length = 1;
            let previous_cell = null;
            if (squares[current_coord] === null) { continue; }
            if (col < (board_size - win_length + 1)) {
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one right, plus one more right ... win_length
                    run_length++
                    if (squares[current_coord+i] !== null && squares[current_coord + i] !== undefined && previous_cell === squares[current_coord+i]) {
                        current_length++
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
            current_length = 1;
            previous_cell = null;
            if (row < (board_size - win_length + 1)) {
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one down, plus one more down ... win_length
                    run_length++
                    if (squares[current_coord + ( i * board_size )] !== null && squares[current_coord + ( i * board_size )] !== undefined && previous_cell === squares[current_coord + ( i * board_size )]) {
                        current_length++
                    }
                    else {
                        previous_cell = squares[current_coord + ( i * board_size )];
                        current_length = 1;
                    }
                    if (win_length <= current_length) {
                        return squares[current_coord]
                    }
                }
            }
            current_length = 1;
            previous_cell = null;
            if (row < (board_size - win_length + 1) && col < (board_size - win_length + 1) ) { //TODO check this is correct bounds
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one down/right, plus one more down/right ... win_length
                    run_length++
                    if (squares[current_coord + ( i * board_size  )+ i] !== null && squares[current_coord  + ( i * board_size  )+ i] !== undefined && previous_cell === squares[current_coord + ( i * board_size  )+ i]) {
                        current_length++
                    }
                    else {
                        previous_cell = squares[current_coord + ( i * board_size ) + i];
                        current_length = 1;
                    }
                    if (win_length <= current_length) {
                        return squares[current_coord]
                    }
                }
            }
            current_length = 1;
            previous_cell = null;
            if (row < (board_size - win_length + 1) && col > (win_length - 2) ) { //TODO check this is correct bounds
                for (let i = 0; i <= win_length; i++) { // if current coordinate equals one down/left, plus one more down/left ... win_length
                    run_length++
                    if (squares[current_coord + ( i * board_size  )- i] !== null && squares[current_coord  + ( i * board_size  ) - i] !== undefined && previous_cell === squares[current_coord + ( i * board_size  )- i]) {
                        current_length++
                    }
                    else {
                        previous_cell = squares[current_coord + ( i * board_size ) - i];
                        current_length = 1;
                    }
                    if (win_length <= current_length) {
                        return squares[current_coord]
                    }
                }
            }
        }
    }
    // console.log(run_length)
    return null
}