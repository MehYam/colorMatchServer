const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const UserFilter = require('./adminUserFilter');
const UserTable = require('./adminUserTable');
const UserAdd = require('./adminUserAdd');

class Portal extends React.Component
{
   constructor() {
      super();
      this.state = { users: [] };
   }
   componentDidMount() {
      this.loadUsers({});
   }
   addUser(user) {

      //KAI: I fundamentally disagree with this approach, but "it works for now".  Guessing what the server's data
      // looks like after a call is just asking for trouble.
      $.ajax({
         type:'POST', url: '/api/admin/users/add', contentType: 'application/json',
         data: JSON.stringify(user),
         success: function(data) 
         {
            var newUsers = this.state.users.slice();

            console.log("new user:", JSON.stringify(data));

            newUsers.push(data);
            this.setState({users: newUsers});
         }.bind(this),
         error: (xhr, status, err) => 
         {
            console.log("error adding user:", err);
         }
      })
   }
   loadUsers(filterTerms) {
      $.ajax('/api/admin/users/get', {data: filterTerms}).done( function(userArray) {
         this.setState({users: userArray});
      }.bind(this));
   }
   render()
   {
      return (
        <div>
            <h1>User Admin Portal</h1>
            <UserTable users={this.state.users}/>
            <hr/>
            <UserFilter onSubmit={(filter) => this.loadUsers(filter)}/>
            <hr/>
            <UserAdd onSubmit={(u) => this.addUser(u)}/>
        </div>
      );
   }
}

module.exports = Portal;