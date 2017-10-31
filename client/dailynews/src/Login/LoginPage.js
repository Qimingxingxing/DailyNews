import React, {PropTypes} from 'react';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      user: {
        email: '',
        password: ''
      }
    };
  }

  // Pre-submission.
  processForm = (event) => {
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;

    // TODO; post login data.
  }

  changeUser = (event) => {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({ user });
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }
}

export default LoginPage;
