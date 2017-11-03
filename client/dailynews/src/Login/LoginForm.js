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
        <div className="container-fluid">
            <h2 className="text-center"> login </h2>
            <div className="login-panel">
                <form onSubmit={onSubmit} action="/">

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