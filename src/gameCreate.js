const React = require('react');
const ReactDOM = require('react-dom');

class GameCreate extends React.Component {
   constructor(props) {
      super(props);

      this.state = { opponent: '' };
      this.handleChange = this.handleChange.bind(this);
   }
   handleChange(e) {
      this.setState({opponent: e.target.value});
   }
   render() {
      return (
         <div>
            <input type='text' placeholder='opponent' value={this.state.opponent} onChange={this.handleChange}/>
            <input type='button' value='Start Game'/>
         </div>
      )
   }
}

module.exports = GameCreate;