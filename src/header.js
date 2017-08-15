const React = require('react');
const Link = require('react-router-dom').Link;

class Header extends React.Component {
   render() {
      return (
         <header>
            <nav>
               <ul>
                  <li><Link to='/'>Home</Link></li>
                  <li><Link to='/admin'>Users</Link></li>
                  <li><Link to='/games'>Games</Link></li>
                  <li><Link to='/voting'>Voting</Link></li>
               </ul>
            </nav>
         </header>
      );
   }
}

module.exports = Header;