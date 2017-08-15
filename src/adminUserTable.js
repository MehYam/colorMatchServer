const React = require('react');
const ReactDOM = require('react-dom');

function UserRow(props)
{
    return (
        <tr>
            <td>{props.user.firstName}</td>
            <td>{props.user.lastName}</td>
            <td className='numericColumn'>{props.user.votesCast}</td>
            <td className='numericColumn'>{props.user._id}</td>
        </tr>
    );
}

class UserTable extends React.Component {
   renderRow(user) {
      return <UserRow key={user._id} user={user}/>;
   }
   render() {
      var userRows = this.props.users.map((user) => this.renderRow(user));
      return (
         <table>
            <thead>
            <tr>
               <th>First</th>
               <th>Last</th>
               <th>Votes Cast</th>
               <th>ID</th>
            </tr>
            </thead>
            <tbody>
               {userRows}
            </tbody>
         </table>
      );
   }
}

module.exports = UserTable;