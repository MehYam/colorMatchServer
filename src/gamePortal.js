const React = require('react');
const ReactDOM = require('react-dom');
const Link = require('react-router-dom').Link;
const $ = require('jquery');

const GameCreate = require('./gameCreate');

class GameRow extends React.Component {
   renderPlayerNames(game) {
      var ids = this.props.game.players.map((player) => player.id);
      return ids.join(', ');
   }
   render() {
      const game = this.props.game;

      const votesNumeric = game.votes || 0;
      const votesLabel = game.elections ? votesNumeric : '-';
      const pct = game.elections ? (votesNumeric/game.elections).toFixed(5) : '-';

      return (
         <tr>
            <td>{this.renderPlayerNames(game)}</td>
            <td className='numericColumn'>{game.moves.length}</td>
            <td className='numericColumn'>{votesLabel}</td>
            <td className='numericColumn'>{pct}</td>
            <td>{this.props.game.seed}</td>
            <td><Link to={`/games/${this.props.game._id}`}>{this.props.game._id}</Link></td>
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
                  <th># Votes</th>
                  <th>Winrate (0-1)</th>
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
            <h1>Games ({this.state.games.length})</h1>
            <GameCreate onClick={(opponent) => this.onCreateGame(opponent)}/>
            <h4>Click the right column link to view/play game</h4>
            <GameTable games={this.state.games}/>
         </div>
      );
   }
}

module.exports = GamePortal;