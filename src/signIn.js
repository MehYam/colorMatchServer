const React = require('react');
const ReactDOM = require('react-dom');

class SignIn extends React.Component {
   render() {
      return (
         <div>This is the SignIn component
            <input type='button' value='Sign In' onClick={this.props.onSignIn}/>
            <input type='button' value='Sign Out' onClick={this.props.onSignOut}/>
         </div>
      );
   }
}

module.exports = SignIn;