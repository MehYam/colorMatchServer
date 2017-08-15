const React = require('react');
const ReactDOM = require('react-dom');

const PaletteTile = require('./paletteTile');

// KAI: isn't this the same thing as Palette, really?
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
         const tileId = {row: this.props.rowIndex, col: c};
         tiles.push(<PaletteTile key={c} color={this.props.row[c] || 0} id={tileId} size={this.props.tileSize} onClick={this.props.onTileClick}/>);
      }
      return (
         <div className='centerChild'>
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
      for (let i = 0; i < game.moves.length; ++i) {
         const playerIdx = i % game.players.length;
         const move = game.moves[i];

         rows[move.y][move.x] = game.players[playerIdx].palette[move.paletteIdx];
      }

      //const rowComponents = rows.map((row) => <GameBoardRow row={row} tileSize={this.props.tileSize}/>);  ......need unique keys
      const rowComponents = [];
      for (let r = 0; r < rows.length; ++r) {
         const row = rows[r];
         rowComponents.push(<GameBoardRow key={r} row={row} rowIndex={r} tileSize={this.props.tileSize} onTileClick={this.props.onTileClick}/>);
      }
      return rowComponents;
   }
   render() {
      return <div className='centerChild'>{this.renderRows()}</div>;
   }
}

module.exports = GameBoard;