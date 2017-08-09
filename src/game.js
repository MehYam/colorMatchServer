const React = require('react');
const ReactDOM = require('react-dom');

class Game extends React.Component {
   render() {
      return <div>This is the game board for {this.props.match.params.gameid}</div>;
   }
}

module.exports = Game;