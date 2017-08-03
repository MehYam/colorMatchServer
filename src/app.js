const React = require('react');
const ReactDOM = require('react-dom');
//const Redirect = require('react-router').Redirect;
const BrowserRouter = require('react-router-dom').BrowserRouter;

const Portal = require('./adminPortal');

function NoMatch() { return <h2>No match for the route</h2>; }

ReactDOM.render(
   (
      <BrowserRouter>
         <Portal />
      </BrowserRouter>
   ),
   document.getElementById('main')
);