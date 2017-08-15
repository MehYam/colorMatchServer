const React = require('react');
const ReactDOM = require('react-dom');

class Home extends React.Component {
   render() {
      return (
         <div className='centerParent'><h1 className='centerChild'>ColorMatch Development Prototype</h1></div>
      );
   }
}

module.exports = Home;