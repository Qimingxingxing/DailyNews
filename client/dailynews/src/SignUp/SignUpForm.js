import React from 'react';
import './SignUpForm.css';
import { Link } from 'react-router';

const SignUpForm = ({
    onSubmit,
    onChange,
    errors,
    user
  }) => (
        <div className="container-fluid">
            <h2 className="text-center"> Sign up</h2>
            <div className="signup-panel">
                <form action="/" onSubmit={onSubmit}>

                    {errors.summary && <div className="row"><p>{errors.summary}</p></div>}
                    <div className="form-group">
                        <label htmlFor="email">Email address:</label>
                        <input type="email" className="form-control" name="email" id="email" onChange={onChange}/>
                    </div>

                    {errors.email && <div className="row"><p className="error-message">{errors.email}</p></div>}
                    <div className="form-group">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" className="form-control" name="password" id="pwd" onChange={onChange} />
                    </div>

                    {errors.password && <div className="row"><p className="error-message">{errors.password}</p></div>}
                    <div className="form-group">
                        <label htmlFor="pwd">Confirm Password:</label>
                        <input type="password" className="form-control" name="confirm_password" id="pwd" onChange={onChange} />
                    </div>

                    <input type="submit" className="btn btn-default" value='Sign Up' />
                    <p> Already have an account? <Link to="/login">Login</Link></p>

                </form>
            </div>
        </div>
    );

export default SignUpForm;