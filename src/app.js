class Portal extends React.Component
{
   constructor() {
      super();
      this.state = { users: [] };
   }
   componentDidMount() {
      $.ajax('/api/users/getAll').done( function(userArray) {
         this.setState({users: userArray});
      }.bind(this));
   }
   addUser(user) {

      //KAI: I fundamentally disagree with this approach, but "it works for now".  Guessing what the server's data
      // looks like after a call is just asking for trouble.
      $.ajax({
         type:'POST', url: '/api/users/add', contentType: 'application/json',
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
   render()
   {
      return (
        <div>
            <h1>User Admin Portal</h1>
            <UserFilter/>
            <hr/>
            <UserTable users={this.state.users}/>
            <hr/>
            <UserAdd onSubmit={(u) => this.addUser(u)}/>
        </div>
      );
   }
}

function UserFilter() {return <div>UserFilter</div>;}

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
      var renderRowCapture = this.renderRow;
      var userRows = this.props.users.map(renderRowCapture);
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

class UserAdd extends React.Component {
   constructor(props) {
      super(props);
      this.state = {value: ''};

      this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleSubmit(e) {
      e.preventDefault();

      var form = document.forms.userAdd;
      var user = { firstName: form.first.value, lastName: form.last.value };

      this.props.onSubmit(user);
   }

   render() {
      return (
         <div>
            <form name="userAdd" onSubmit={this.handleSubmit}>
               <input type="text" name="first" placeholder="first name" defaultValue="foo"/>
               <input type="text" name="last"  placeholder="last name" defaultValue="bar"/>
               <input type="submit" value="Add User"/>
            </form>
         </div>
      );
   }
}

ReactDOM.render(
  <Portal />,
  document.getElementById('main')
);