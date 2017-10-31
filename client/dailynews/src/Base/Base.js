import React, { PropTypes } from 'react';
import Auth from '../Auth/Auth';
import { Link } from 'react-router';
import './Base.css';

const Base = ({ children }) => (
    <div>
        <nav className="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a href="/" className="navbar-brand">  Tap News</a>
                </div>

                <ul className="nav navbar-nav navbar-right">
                    {Auth.isUserAuthenticated() ?
                        (<div>
                            <li>{Auth.getEmail()}</li>
                            <li><Link to="/logout">Log out</Link></li>
                        </div>)
                        :
                        (<div>
                            <li><Link to="/login">Log in</Link></li>
                            <li><Link to="/signup">Sign up</Link></li>
                        </div>)
                    }
                </ul>

            </div>
        </nav>
        <br />
        {children}
    </div>
);

export default Base;
