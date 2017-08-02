const React = require('react');
const ReactDOM = require('react-dom');

class UserAdd extends React.Component {
   constructor(props) {
      super(props);
      this.state = {value: ''};

      this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleSubmit(e) {
      e.preventDefault();

      const form = document.forms.userAdd;
      const user = { firstName: form.first.value, lastName: form.last.value };

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

module.exports = UserAdd;