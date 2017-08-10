const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

class PaletteTile extends React.Component {
   render() {
      return (<span>{String(this.props.color)}</span>);
   }
}
class Palette extends React.Component {
   render() {
      const tiles = this.props.player.palette.map((color) => <PaletteTile key={color} color={color}/>);
      return (
         <div>
            <h2>user: {this.props.player.id}</h2>
            {tiles}
         </div>
      );
   }
}
class GameBoardRow extends React.Component {
   render() {
      return <div>GameBoardRow</div>;
   }
}
class GameBoard extends React.Component {
   constructor() {
      super();
      this.state = {};
   }
   renderRows() {
      return <GameBoardRow/>;
   }
   render() {
      return <div>{this.renderRows()}</div>;
   }
}
class Game extends React.Component {
   constructor() {
      super();

      //KAI: this state should be loaded somewhere, before we render the component - we shouldn't need gameTemplate
      const gameTemplate = {
         seed: 'a seed',
         width: 3,
         height: 3,
         players: [
            {id: 0, palette: []},
            {id: 1, palette: []}
         ],
         moves: []
      };
      this.state = { game: gameTemplate };
   }
   componentDidMount() {
      this.loadGame(this.props.match.params.gameid);
   }
   loadGame(gameId) {
      console.log('loading game', gameId);
      $.ajax({
         url: '/api/getGame',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({gameId: gameId}),
         success: function(game) {
            this.setState({game: game});
         }.bind(this),
         error: (xhr, status, err) =>
         {
            console.error('failed retrieving game')
         }
      });
   }
   render() {
      return (
         <div>
            <h1>This is the game board {this.props.match.params.gameid}</h1>
            <Palette player={this.state.game.players[1]}/>
            <GameBoard game={this.state.game}/>
            <Palette player={this.state.game.players[0]}/>
         </div>
      );
   }
}

module.exports = Game;