import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = props.winning ? "square win" : "square";

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function List(props) {
    const children = props.isBold ?
      <b>{props.children}</b> : props.children;

    return (
      <li>
        <button onClick={props.onClick}>
          {children}
        </button>
      </li>
    );
}

class Board extends React.Component {
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

  renderRow(i) {
    const col = [0, 1, 2];
    var rowdiv = col.map((c) => {
      return this.renderSquare(i*3+c);
    });

    return <div className="board-row" key={i}>{rowdiv}</div>;
  }

  render() {
    const row = [0, 1, 2];
    var boarddiv = row.map((r) => {
      return this.renderRow(r)
    });

    return <div>{boarddiv}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [ {squares: Array(9).fill(null)} ],
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
      history: history.concat([{squares: squares}]),
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

    if (this.state.history.length === 10)
      status = "It's a draw";

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
      return lines[i];
    }
  }
  return null;
}
