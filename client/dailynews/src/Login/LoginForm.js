import React from 'react';
import PropTypes from 'prop-types';
import './LoginForm.css';
import { Link } from 'react-router';

const LoginForm = ({
    onSubmit,
    onChange,
    errors,
    user
  }) => (
        <div>
            <h2> login </h2>
            <div>
                <form onSubmit={onSubmit} action="/">
                    <label>Email address:</label>
                    <input type="email" name="email" onChange={onChange} />

                    <label>Password:</label>
                    <input type="password" name="password" onChange={onChange} />

                    <button type="submit" className="btn btn-default">Submit</button>
                    <p> Don't have an account? <Link to="/signup">Sign up</Link></p>
                </form>
            </div>
        </div>
    );
LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};
export default LoginForm;