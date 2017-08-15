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
            <input type='text' placeholder='enter first name' value={this.state.opponent} onChange={this.handleChange}/>
            <input type='button' value='Start New Game' onClick={() => this.props.onClick(this.state.opponent)}/>
         </div>
      )
   }
}

module.exports = GameCreate;