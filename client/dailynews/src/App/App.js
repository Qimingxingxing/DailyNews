import React from 'react';
import logo from "./logo.png";
import "./App.css";
import NewsPanel from "../NewsPanel/NewsPanel";
import Grid from "react-bootstrap/lib/Grid";
class App extends React.Component {
    render(){
        return (
            <div>
                <img className= "logo" src={logo} alt="logo" />
                <Grid>
                    <NewsPanel />
                </Grid>
            </div>
        )
    };
}    
export default App;