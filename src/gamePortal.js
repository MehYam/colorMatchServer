const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const GameCreate = require('./gameCreate');

class GameRow extends React.Component {
   renderPlayerNames(game) {
      let retval = '';
      this.props.game.players.forEach((player) => {
         retval += player.id;
         retval += ' ';
      });
      return retval;
   }
   render() {
      return (
         <tr>
            <td>{this.renderPlayerNames(this.props.game)}</td>
            <td>{this.props.game.moves.length}</td>
            <td>{this.props.game.seed}</td>
            <td>{this.props.game._id}</td>
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
      if (this.props.games.length) console.log(this.props.games[0].pending);
      return (
         <table>
            <thead>
               <tr>
                  <th>Players</th>
                  <th># Moves</th>
                  <th>Seed</th>
                  <th>ID</th>
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
      console.log("loading games");
      $.ajax('/api/getGames').done( function(gamesArray) {
         this.setState({games: gamesArray});
      }.bind(this));
   }
   onCreateGame(opponent) {
      $.ajax({
         url: '/api/createGame',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({opponent: opponent}),
         success: function(data)
         {
            this.loadGames();
         }.bind(this),
         error: (xhr, status, err) =>
         {
            console.error('error creating game:', err, status);
         }
      });
   }
   render() {
      return (
         <div>
            <h1>Games</h1>
            <GameCreate onClick={(opponent) => this.onCreateGame(opponent)}/>
            <div>Games: {this.state.games.length}</div>
            <GameTable games={this.state.games}/>
         </div>
      );
   }
}

module.exports = GamePortal;