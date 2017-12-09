import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import Auth from '../Auth/Auth';

class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);
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

    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      cache: false,
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          errors: {}
        });
        response.json().then(function(json) {
          console.log(json);
          Auth.authenticateUser(json.token, email);
          this.context.router.replace("/");
        }.bind(this));
      }
      else {
        console.log("login failed");
        response.json().then(function(json) {
          const errors = json.errors ? json.errors : {};
          errors.summary = json.message;
          console.log(errors);
          this.setState({ errors });
        }.bind(this));
      }
    });
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
LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};
export default LoginPage;
