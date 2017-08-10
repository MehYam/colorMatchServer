const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

class PaletteTile extends React.Component {
   constructor() {
      super();
   }
   onClick() {
      console.log('clicked', this.props.color);
   }
   render() {
      const styleF = {
         backgroundColor: '#' + this.props.color.toString(16),
         width: this.props.size,
         height: this.props.size
      };
      return (<div className='paletteTile' style={styleF} onClick={() => this.onClick()}></div>);
   }
}
class Palette extends React.Component {
   render() {
      const tiles = this.props.player.palette.map((color) => <PaletteTile key={color} color={color} size={this.props.tileSize}/>);
      return (
         <div className='palette'>
            <h2>{this.props.player.id} - {this.props.label}</h2>
            {tiles}
            <div className='clear'/>
         </div>
      );
   }
}
// KAI: is this the same thing as Palette, really?
class GameBoardRow extends React.Component {
   renderTile(color) {
      return <PaletteTilex key={color} color={color} size={this.props.tileSize}/>;
   }
   render() {
      //KAI: there's some difference between new Array() and [] that makes the following lines not work
      //const tiles = this.props.row.map((color) => <PaletteTilex key={color} color={color} size={this.props.tileSize}/>);
      //const tiles = [ <PaletteTilex color={0xff0000} size={20}/> ];
      const tiles = [];
      for (let c = 0; c < this.props.row.length; ++c) {
         tiles.push(<PaletteTile key={c} color={this.props.row[c] || 0} size={this.props.tileSize}/>);
      }
      return (
         <div className='palette'>
            {tiles}
            <div className='clear'/>
         </div>
      );
   }
}
class GameBoard extends React.Component {
   renderRows() {

      // the game state is a minimal representation;  pad it out to make rendering easier
      const game = this.props.game;
      const rows = new Array(game.height);
      for (let r = 0; r < rows.length; ++r) {
         rows[r] = new Array(game.width);
      }

      // populate the grid from the list of moves
      console.log('moves', game.moves.length);
      for (let i = 0; i < game.moves.length; ++i) {
         const playerIdx = i % game.players.length;
         const move = game.moves[i];

         rows[move.y][move.x] = game.players[playerIdx].palette[move.paletteIdx];
      }

      //const rowComponents = rows.map((row) => <GameBoardRow row={row} tileSize={this.props.tileSize}/>);  ......need unique keys
      const rowComponents = [];
      for (let r = 0; r < rows.length; ++r) {
         const row = rows[r];
         rowComponents.push(<GameBoardRow key={r} row={row} tileSize={this.props.tileSize}/>);
      }
      return rowComponents;
   }
   render() {
      return <div>{this.renderRows()}</div>;
   }
}
class Game extends React.Component {
   constructor() {
      super();

      //KAI: this state should be loaded before we render anything at all.  Need a loading screen here and everywhere else
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
            <h1>This is game board {this.props.match.params.gameid}</h1>
            <Palette player={this.state.game.players[1]} label='(Opponent)' tileSize={60}/>
            <br/>
            <GameBoard game={this.state.game} tileSize={120}/>
            <Palette player={this.state.game.players[0]} label='(Me)' tileSize={60}/>
         </div>
      );
   }
}

module.exports = Game;