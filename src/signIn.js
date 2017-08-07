const React = require('react');
const ReactDOM = require('react-dom');

class SignIn extends React.Component {
   constructor(props) {
      super(props);

      this.state = {uname: props.signedInStatus};
      this.handleChange = this.handleChange.bind(this);
   }
   handleChange(e) {
      this.setState({uname: e.target.value});
   }
   render() {
      let message = null;
      let form = null;
      if (this.props.signedInStatus) {
         message = <div>Signed in as: <b>{this.props.signedInStatus}</b></div>
         form = <input type='button' value='Sign Out' onClick={this.props.onSignOut}/>
      }
      else {
         message = <div>Please sign in:</div>;
         form = 
            <div>
               <input type='text' name="first" placeholder="first name" value={this.state.value} onChange={this.handleChange}/>
               <input type='button' value='Sign In' onClick={() => this.props.onSignIn(this.state.uname)}/>
            </div>;
      }
      return (
         <div>
            {message}
            {form}
         </div>
      );
   }
}

module.exports = SignIn;