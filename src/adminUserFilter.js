const React = require('react');
const ReactDOM = require('react-dom');

class UserFilter extends React.Component {
   constructor(props) {
      super(props);

      const initialFilter = this.props.firstName || '';

      this.state = {value: initialFilter};
      this.handleSubmit = this.handleSubmit.bind(this);
   }
   handleSubmit(e) {
      e.preventDefault();

      const form = document.forms.userFilter;
      const terms = { firstName: form.first.value };

      this.props.onSubmit(terms);
   }
   handleChange(e) {
      this.setState({value: event.target.value});
   }
   render() {
      return (
         <div>
            <form name="userFilter" onSubmit={this.handleSubmit}>
               <input type="text" name="first" placeholder="first name" value={this.state.value} onChange={this.handleChange}/>
               <input type="submit" value="Apply Filter"/>
            </form>
         </div>
      );
   }
}

module.exports = UserFilter;