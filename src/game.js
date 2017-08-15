const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const PaletteTile = require('./paletteTile');
const GameBoard = require('./gameBoard');

class Palette extends React.Component {
   render() {
      const tiles = this.props.player.palette.map((color) => <PaletteTile key={color} color={color} id={color} size={this.props.tileSize} onClick={this.props.onTileClick}/>);
      return (
         <div className='centerChild'>
            {tiles}
            <h3>{this.props.player.id} - {this.props.label}</h3>
            <div className='clear'/>
         </div>
      );
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

      this.onPaletteTileClick = this.onPaletteTileClick.bind(this);
      this.onGameBoardTileClick = this.onGameBoardTileClick.bind(this);
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
   doMove(move) {
      console.log('doMove', move);
      $.ajax({
         url: '/api/doMove',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(move),
         success: function(game) {
            this.setState({game: game});
         }.bind(this),
         error: (xhr, status, err) => console.error('doMove failed')
      });     
   }
   get ourId() {
      return localStorage.user1; // KAI: hack, pass the current user ID through the routes, instead.  Check to see how many render()'s happen
   }
   get ourPlayer() {
      const players = this.state.game.players;
      return players[0].id == this.ourId ? players[0] : players[1];
   }
   onPaletteTileClick(color) {
      console.log('onPaletteTileClick', '#' + color.toString(16));

      // check that color isn't used. If it isn't, set as current color
      //KAI: this should probably be set in state to do things the React way?
      this.selectedPaletteColor = color;
   }
   onGameBoardTileClick(location) {
      //KAI: disable these when the game's done (after server robustness testing)
      console.log('onGameBoardTileClick', location, this.selectedPaletteColor);

      console.log('whut?', location.col, location.row);

      // if there's a color selected, tell the server that we're making this move, and re-render the board
      if (this.selectedPaletteColor) {
         const ourPlayer = this.ourPlayer;
         this.doMove({
            gameId: this.props.match.params.gameid,
            x: location.col,
            y: location.row,
            paletteIdx: ourPlayer.palette.indexOf(this.selectedPaletteColor)
         });
      }
   }
   get gameComplete() {
      return this.state.game.moves.length >= (this.state.game.width * this.state.game.height);
   }
   renderCompletionMessage() {
      return this.gameComplete ? <h2>Game Complete</h2> : null;
   }
   render() {
      // what index player are we?
      let players = this.state.game.players.slice();
      console.assert(players.length == 2, 'we can only currently render exactly two players');

      if (players[0].id == this.ourId) {
         players.reverse();
      }

      // whose turn is it?
      const whoseTurn = this.state.game.moves.length % this.state.game.players.length;
      const ourTurn = whoseTurn == this.state.game.players.findIndex((player) => player.id == this.ourId);

      let otherLabel = '(Other player)';
      let ourLabel = '(You)';
      if (!this.gameComplete) {
         if (ourTurn) {
            ourLabel += ' <= YOUR TURN, please place a color';
         }
         else {
            otherLabel += ' <= THEIR TURN, awaiting move...';
         }
      }
      return (
         <div className='centerParent'>
            <div className='centerChild'>
               {this.renderCompletionMessage()}
               <Palette player={players[0]} label={otherLabel} tileSize={60}/>
               <GameBoard game={this.state.game} tileSize={142} onTileClick={this.onGameBoardTileClick}/>
               <Palette player={players[1]} label={ourLabel} tileSize={60} onTileClick={this.onPaletteTileClick}/>
               <div>Game <b>{this.props.match.params.gameid}</b></div>
            </div>
         </div>
      );
   }
}

module.exports = Game;