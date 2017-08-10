const React = require('react');
const ReactDOM = require('react-dom');
const BrowserRouter = require('react-router-dom').BrowserRouter;
const HashRouter = require('react-router-dom').HashRouter;
const Switch = require('react-router-dom').Switch;
const Route = require('react-router-dom').Route;
const Redirect = require('react-router-dom').Redirect;

const AdminPortal = require('./adminPortal');
const Header = require('./header');
const Home = require('./home');
const SignIn = require('./signIn');
const GamePortal = require('./gamePortal');
const Game = require('./game');

const $ = require('jquery');

class NoMatch extends React.Component {
   render() { return <h2>Page not found</h2>; }
}

class App extends React.Component {
   constructor() {
      super();

      this.state = { signedInStatus:  '' };
   }
   componentDidMount() {
      this.updateSignedInStatus();
   }
   updateSignedInStatus() {
      this.setState({ signedInStatus: localStorage.user1 });
   }
   onSignIn(uname) {
      console.log('signing in as', uname);
      $.ajax({
         url: '/api/signin',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({firstName: uname}),
         success: function(data)
         {
            if (data.user && data.user.firstName)
            {
               localStorage.setItem("user1", data.user.firstName);
               this.updateSignedInStatus();
            }
         }.bind(this),
         error: (xhr, status, err) =>
         {
            console.error('error signing in:', err);
         }
      });
   }
   onSignOut() {
      $.ajax({
         url: '/api/signout',
         type: 'GET'
      });

      localStorage.removeItem("user1");
      this.updateSignedInStatus();
   }
   render() {
      return (
         <div>
            <SignIn signedInStatus={this.state.signedInStatus} onSignIn={this.onSignIn.bind(this)} onSignOut={this.onSignOut.bind(this)}/>
            <Header/>
            <Switch>
               <Route exact path='/' component={Home}/>
               <Route exact path='/games' component={GamePortal}/>
               <Route path='/admin' component={AdminPortal}/>
               <Route path='/games/:gameid' component={Game}/>
               <Route path='*' component={NoMatch}/>
            </Switch>
         </div>
      );
   }   
}
// how to send props down through routes:
// <Route path='/signin' render={() => <SignIn onSignIn={this.onSignIn.bind(this)} onSignOut={this.onSignOut.bind(this)}/> } />

ReactDOM.render(
   (
      <HashRouter>
         <App/>
      </HashRouter>
   ),
   document.getElementById('main')
);