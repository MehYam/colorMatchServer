const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const GameCreate = require('./gameCreate');

class GameRow extends React.Component {
   render() {
      return (
         <tr>
            <td>{this.props.game.player1}</td>
            <td>{this.props.game.player2}</td>
            <td>{String(this.props.game.pending)}</td>
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
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Pending</th>
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