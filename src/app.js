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

const $ = require('jquery');

class NoMatch extends React.Component {
   render() { return <h2>Page not found</h2>; }
}

class App extends React.Component {
   constructor() {
      super();
      this.state = {
         signedInStatus: 'not signed in'
      };
   }
   onSignIn() {
      console.log("signing in");
      $.ajax({
         url: '/api/signin',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({firstName: 'Kai'}),
         success: function(data)
         {
            this.setState({ signedInStatus: 'signed in as ' + data.user.firstName})
         }.bind(this)
      });
   }
   onSignOut() {
      $.ajax({
         url: '/api/signout',
         type: 'GET'
      });
      this.setState({ signedInStatus: 'not signed in'});
   }
   render() {
      return (
         <div>
            <Header signedInStatus={this.state.signedInStatus}/>
            <Switch>
               <Route exact path='/' component={Home}/>
               <Route path='/admin' component={AdminPortal}/>
               <Route path='/signin' render={() => <SignIn onSignIn={this.onSignIn.bind(this)} onSignOut={this.onSignOut.bind(this)}/> } />
               <Route path='*' component={NoMatch}/>
            </Switch>
         </div>
      );
   }   
}
ReactDOM.render(
   (
      <HashRouter>
         <App/>
      </HashRouter>
   ),
   document.getElementById('main')
);