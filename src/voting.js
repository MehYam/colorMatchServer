const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const GameBoard = require('./gameBoard');
const Utils = require('./utils');

class VoteCandidate extends React.Component {
   render() {
      return (
         <div className='voteCandidate'>
            <div>
               <GameBoard game={this.props.game} tileSize={60}/>
               <br/>
               <input className='centerChild' type='button' value='Vote!' onClick={this.props.onVote}/>
            </div>
         </div>
      );
   }
}
class Voting extends React.Component {
   constructor() {
      super();

      this.state = {games: []};
   }
   componentDidMount() {
      this.loadCandidates();
   }
   loadCandidates() {
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
   onVote(gameId) {
      console.log('voting for', gameId);

      // tell server
      $.ajax({
         url: '/api/doVote',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({gameId: gameId}),
         error: (xhr, status, err) => console.error('doVote error', err)
      })

      // KAI: disable/nuke buttons to prevent double voting

      // load new candidates
      this.loadCandidates();
   }
   renderCandidates() {
      const candidates = [];
      let key = 0;
      this.state.games.forEach((game) =>
      {
         candidates.push(<VoteCandidate game={game} key={game._id} onVote={() => this.onVote(game._id)}/>)
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