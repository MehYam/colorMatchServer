const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const GameCreate = require('./gameCreate');

class GameRow extends React.Component {
   render() {
      return (
         <tr>
            <td>{this.props.game._id}</td>
            <td>{this.props.game.opponent}</td>
            <td>{this.props.game.pending}</td>
         </tr>
      );
   }
}
class GameTable extends React.Component {
   renderRow(game) {
      return <GameRow key={game._id} game={game}/>
   }
   render() {
      var games = this.props.games.map((game) => this.renderRow(game));
      return (
         <table>
            <thead>
               <tr>
                  <th>ID</th>
                  <th>Opponent</th>
                  <th>Finished</th>
               </tr>
            </thead>
            <tbody>
               {games}
            </tbody>
         </table>
      );
   }
}
class GamePortal extends React.Component {
   constructor() {
      super();
      this.state = { games: [] };
   }
   componentDidMount() {
      this.loadGames();
   }
   loadGames() {
      $.ajax('/api/getGames').done( function(gamesArray) {
         this.setState({games: gamesArray});
      }.bind(this));
   }
   render() {
      return (
         <div>
            <h1>Games</h1>
            <GameCreate/>
            <div>Games: {this.state.games.length}</div>
            <GameTable games={this.state.games}/>
         </div>
      );
   }
}

module.exports = GamePortal;