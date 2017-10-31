import React, {PropTypes} from 'react';
import './LoginForm.css';
import { Link } from 'react-router';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = props.onsubmit;
        this.onChange = props.onChange;
        this.errors = props.errors;
        this.user = props.user;
    }

    render() {
        return (
            <div className="container-fluid">
                <h2 className="text-center"> login </h2>
                <div className="login-panel">
                    <form onSubmit={this.onSubmit} action="/">

                        {this.errors.summary && <div className="row"><p>{this.errors.summary}</p></div>}
                        <div className="form-group">
                            <label for="email">Email address:</label>
                            <input type="email" className="form-control" name="email" id="email" />
                        </div>

                        {this.errors.email && <div className="row"><p className="error-message">{this.errors.email}</p></div>}
                        <div className="form-group">
                            <label for="pwd">Password:</label>
                            <input type="password" className="form-control" name="password" id="pwd" onChange={this.onChange} />
                        </div>

                        <button type="submit" className="btn btn-default">Submit</button>
                        <p> Don't have an account? <Link to="/signup">Sign up</Link></p>

                    </form>
                </div>
            </div>
        );
    }

}
  
export default LoginForm;