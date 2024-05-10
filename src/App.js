import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function Square({ value, onSquareClick }) {
    const boxSize = 44 //px

    if (value == "X") {
        return  <Button  style={{ fontSize: 30, m: 1, height: boxSize , border: '1px solid #999', minWidth: boxSize, width:boxSize  }} variant="outlined" color="success" >{value}</Button> 
    } else if (value == "0") {
        return <Button onClick={onSquareClick} variant="outlined" color="error" style={{ fontSize: 30, m: 1, height: boxSize , border: '1px solid #999', minWidth: boxSize, width:boxSize,  }}>{value}</Button>
    }
    else {
        return <Button onClick={onSquareClick} variant="outlined" style={{ fontSize: 30, m: 1, height: boxSize , border: '1px solid #999', minWidth: boxSize, width:boxSize,  }}>{value}</Button>
    }
    // return <button onClick={onSquareClick} className="square" >{value}</button>
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
        status = "Winner: " + winner
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O")
    }
    // console.log(status)

    const board_size = playSize;
    const row_size = board_size;
    const col_size = board_size; //set up for debugging with various board sizes
    return <>
          <div className="status"><strong>{status}</strong></div>
          {Array.from(Array(row_size).keys()).map(row => (
            <div className="board-row">
            {Array.from(Array(col_size).keys()).map(col => (
                <Square key={row * board_size + col} value={squares[row * board_size + col]} onSquareClick={() => handleClick(row * board_size + col)} />
            ))}
            </div>
          ))}
    </>;
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
            <Box onSubmit={setWidth} component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch'}, }} noValidate autoComplete="off" >
                <div style={ {display:'flex', alignItems:'center'} }>
                    <TextField  name="width"  id="outlined-search" label="Search field" type="search" />
                    <Button type="submit" variant="contained">Go</Button>
                </div>
            </Box>
            <Box onSubmit={setWinLength} component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch'}, }} noValidate autoComplete="off" >
                <div style={ {display:'flex', alignItems:'center'} }>
                    <TextField  name="winlength"  id="outlined-search" label="Search field" type="search" />
                    <Button type="submit" variant="contained">Go</Button>
                </div>
            </Box>
            <div style={ {margin:'10px'} }>
                <div className='game'>
                    <div className='game-board'>
                        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} playSize={boardSize} winSize={winLength} />    
                    </div>
                    <div className='game-info'>
                        <ol>{moves}</ol>
                    </div>

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