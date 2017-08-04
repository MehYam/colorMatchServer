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

class NoMatch extends React.Component {
   render() { return <h2>Page not found</h2>; }
}

class App extends React.Component {
   render() {
      return (
         <div>
            <Header/>
            <Switch>
               <Route exact path='/' component={Home}/>
               <Route path='/admin' component={AdminPortal}/>
               <Route path='/signin' component={SignIn}/>
               <Route path='*' component={NoMatch}/>
            </Switch>
         </div>
      );
   }   
}
ReactDOM.render(
   (
      <BrowserRouter>
         <App/>
      </BrowserRouter>
   ),
   document.getElementById('main')
);

      // <HashRouter>
      //    <Switch>
      //       <Redirect exact from="/" to="/admin/users"/>
      //       <Route path="/admin/users" component={Portal}/>
      //       <Route path="*" component={NoMatch}/>
      //    </Switch>
      // </HashRouter>
