import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Rather than creating a class, use functional components for components which only render
function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      movesCoord: [{
        x: null, y: null
      }]
    };
  }

  /*
    @ Function passed to grandchild component (through props) which is attached to click event
      So that the logic and state is stored in this component rather than the child
    @ Also push the new game state to state.history
  */
  handleClick(i){
    // Slicing the history array until stepNumber+1 allows handleClick to work in a previous time
    // Not pulling the whole history array, just til the moment you want to re-play
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    // Get all the moves (x, y)
    const movesCoord = this.state.movesCoord.slice(0, this.state.stepNumber + 1);
    //const currentMove = moves[moves.length-1];

    // Return early if someone has already won || square is alredy filled
    if (calculateWinner(squares) || squares[i]){
      return;
    }

    // Convert square index into x and y coordinates
    const {x, y} = getCoordinates(i);

    // Push the new current state to history array and prepare for next turn
    squares[i] = this.state.xIsNext ? 'X':'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      movesCoord: movesCoord.concat([{x, y}])
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Create list of the current game state
    // @Step - State of the current iteration of the game being mapped
    // @Move - Move Number

    const moves = this.state.movesCoord.map((step, move)=>{

      const desc = typeof step.x === "number"  ? `Move # ${move} on (${step.x},${step.y})` : 'Game Start';

      // current move
      if (move === this.state.stepNumber){
        return (
          <li key={move}>
            <a href="#" className="currentMove" onClick={()=> this.jumpTo(move)}>{desc}</a>
          </li>
        );
      } else{
        return (
          <li key={move}>
              <a href="#" onClick={()=> this.jumpTo(move)}>{desc}</a>
          </li>
        );
      }
    });

    /*
    const moves = this.state.movesCoord.map((step, move)=>{
      const desc = typeof step.x === "number"  ? `Move # ${move} on (${step.x},${step.y})` : 'Game Start';
      // Construct and return element pointing to a specific time in the game
      return (
        <li key={move}>
          <a href="#" onClick={()=> this.jumpTo(move)}>{desc}</a>
        </li>
      )
    });
    */

    // Nested if statement if the game is not yet finished
    let status = winner ? `Winner: ${winner}!` : `Next Player: ${current.xIsNext ? 'X' : 'O'}`

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
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

// @squares - the state of the squares
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i< lines.length; i++){
    // Destructuring Array Assignment
    const [a,b,c] = lines[i];
    // Check if all three indexes are true
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}

function getCoordinates(index){
  const col = 3;
  const x = Math.floor(index % col);
  const y = Math.floor(index / col); 
  return {x, y};
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
