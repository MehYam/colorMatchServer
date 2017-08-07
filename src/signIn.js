const React = require('react');
const ReactDOM = require('react-dom');

class SignIn extends React.Component {
   render() {
      return (
         <div>
            <input type='text' placeholder="first name"/>
            <input type='button' value='Sign In' onClick={this.props.onSignIn}/>
            <input type='button' value='Sign Out' onClick={this.props.onSignOut}/>
         </div>
      );
   }
}

module.exports = SignIn;