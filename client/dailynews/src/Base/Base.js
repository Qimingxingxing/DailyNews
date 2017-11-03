import React from 'react';
import PropTypes from 'prop-types';

import Auth from '../Auth/Auth';
import { Link } from 'react-router';

const Base = ({ children }) => (
    <div>
        <nav className="navbar navbar-inverse">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a href="/" className="navbar-brand">  Tap News</a>
                </div>

                {Auth.isUserAuthenticated() ?
                    (<div>
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to="#">{Auth.getEmail()}</Link></li>
                            <li><Link to="/logout">Log out</Link></li>
                        </ul>

                    </div>)
                    :
                    (<div>
                        <ul className="nav navbar-nav navbar-right">

                            <li><Link to="/login">Log in</Link></li>
                            <li><Link to="/signup">Sign up</Link></li>
                        </ul>

                    </div>)
                }
            </div>
        </nav>
        <br />
        {children}
    </div>
);
Base.propTypes = {
    children: PropTypes.object.isRequired
  };
export default Base;
