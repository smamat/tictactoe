import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.winning) {
    return (
      <button className="squarewin" onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

function List(props) {
  if (props.isBold) {
    return (
      <li>
        <button onClick={props.onClick}>
          <b>{props.children}</b>
        </button>
      </li>
    );
  }
  return (
    <li>
      <button onClick={props.onClick}>
        {props.children}
      </button>
    </li>
  );

}

class Board extends React.Component {
  renderRow(i) {
    var row = [];
    for (var j=0; j<3; j++)
      row.push(this.renderSquare(i++));
    return row;
  }

  renderCol() {
    var col = [];
    for (var i=0; i<3; i++)
      col.push(
        <div key={i} className="board-row">
          {this.renderRow(i*3)}
        </div>
      );
    return col;
  }

  renderSquare(i) {
    const winner = this.props.winner;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winning={winner&&(i===winner[0]||i===winner[1]||i===winner[2])}
        key={i}
      />
    );
  }

  render() {
    return ( this.renderCol() );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      movePos: [null],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const movePos = this.state.movePos.slice(0, this.state.stepNumber+1);

    // if someone wins or square is filled, do nothing
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      movePos : movePos.concat([i]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    console.log("Winner: "+winner);
    const movePos = this.state.movePos;


    const moves = history.map((step, move) => {
      const col = movePos[move]%3;
      const row = (movePos[move]-col)/3;
      const desc = move ?
        'Go to move #' + move + ' (' + col + ',' + row + ')' :
        'Go to game start';
      return (
        <List key={move}
          onClick={() => this.jumpTo(move)}
          isBold={move===this.state.stepNumber}
          >
          {desc}
        </List>
      );

    });

    let status;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //console.log("winner: "+lines[i]);
      //return squares[a];
      return lines[i];
    }
  }
  return null;
}
