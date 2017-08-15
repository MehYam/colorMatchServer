const React = require('react');
const ReactDOM = require('react-dom');

const GameBoard = require('./gameBoard');

class Voting extends React.Component {
   componentDidMount() {

   }
   render() {
      return (
         <div>
            <div className='float'><GameBoard/></div>
            <div className='float'><GameBoard/></div>
            <div className='float'><GameBoard/></div>
            <div className='clear'></div>
         </div>
      );
   }
}

module.exports = Voting;