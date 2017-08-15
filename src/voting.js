const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const GameBoard = require('./gameBoard');
const Utils = require('./utils');

class VoteEntry extends React.Component {
   render() {

   }
}
class Voting extends React.Component {
   constructor() {
      super();

      this.state = {games: []};
   }
   componentDidMount() {
      this.loadGames();
   }
   loadGames() {
      console.log("loading vote candidates");
      $.ajax({
         url: '/api/getVoting',
         type: 'GET',
         contentType: 'application/json',
         success: function(games) {
            console.log('getVoting returned', games.length);
            this.setState({games: games});
         }.bind(this),
         error: (xhr, status, err) => console.error('getVoting failed', err)
      });
   }
   renderCandidates() {
      const candidates = [];
      let key = 0;
      this.state.games.forEach((game) =>
      {
         candidates.push(<div className='float' key={++key}><GameBoard game={game}/></div>);
      });
      return candidates;
   }
   render() {
      return (
         <div>
            <h1 className='centerChild'>Vote on the Game you like best!</h1>
            {this.renderCandidates()}
            <div className='clear'></div>
         </div>
      );
   }
}

module.exports = Voting;