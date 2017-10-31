import React, {PropTypes} from 'react';
import './SignUpForm.css';

class SignUpForm extends React.Component {
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
                <h2 className="text-center"> Sign up</h2>
                <div className="signup-panel">
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

                        {this.errors.password && <div className="row"><p className="error-message">{this.errors.password}</p></div>}
                        <div className="form-group">
                            <label for="pwd">Confirm Password:</label>
                            <input type="password" className="form-control" name="confirm_password" id="pwd" onChange={this.onChange} />
                        </div>

                        <button type="submit" className="btn btn-default">Submit</button>
                        <p> Already have an account? <a href="/login">Login</a></p>

                    </form>
                </div>
            </div>
        );
    }

}
  
export default SignUpForm;