function Square({ tileNum }) {
    function handleClick() {
        console.log('clicked!');
        if (document.body.style['background-color'] == 'gold') {
            document.body.style['background-color'] = 'green'
        } else {
            document.body.style['background-color'] = 'gold';
        }
        
    }

    return <button onClick={handleClick} className="square">{tileNum}</button>
}

export function Board() {
    return <>
    <div className="board-row">
        <Square tileNum="1" />
        <Square tileNum="2" />
        <Square tileNum="3" />
    </div>
    <div className="board-row">
        <Square tileNum="4" />
        <Square tileNum="5" />
        <Square tileNum="6" />
    </div>
    <div className="board-row">
        <Square tileNum="7" />
        <Square tileNum="8" />
        <Square tileNum="9" />
    </div>
    </>;
}

