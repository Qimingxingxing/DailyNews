import React from "react";
import ReactDOM from "react-dom";
import {browserHistory, Router} from "react-router";
import routes from "./routes";
import LoginPage from './Login/LoginPage';
import SignUpPage from './SignUp/SignUpPage';
import App from "./App/App";
ReactDOM.render(
    <Router history={browserHistory} routes={routes} />,
    document.getElementById('root')
)
