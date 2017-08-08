const React = require('react');
const ReactDOM = require('react-dom');

function UserRow(props)
{
    return (
        <tr>
            <td>{props.user._id}</td>
            <td>{props.user.lastName}</td>
            <td>{props.user.firstName}</td>
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
               <th>ID</th>
               <th>Last</th>
               <th>First</th>
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