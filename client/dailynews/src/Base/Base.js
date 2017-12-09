import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../Auth/Auth';
import "./Base.css";
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});


class Base extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar color="accent" position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Tap News
                        </Typography>
                        <div>
                            {Auth.isUserAuthenticated() ? (
                                <div>
                                    {Auth.getEmail()}
                                    <Button color="inherit"><Link className="navButton" to="/logout">Log out</Link></Button>
                                </div>
                            )
                                :
                                (
                                    <div>
                                        <Button color="inherit"><Link className="navButton" to="/login">Log in</Link></Button>
                                        <Button color="inherit"><Link className="navButton" to="/signup">Sign up</Link></Button>
                                    </div>
                                )
                            }
                        </div>
                    </Toolbar>
                </AppBar>
                <br />
                {this.props.children}
            </div>
        );
    }

}
Base.propTypes = {
    children: PropTypes.object.isRequired
};
export default withStyles(styles)(Base);
