import React from 'react';
import PropTypes from 'prop-types';
import './LoginForm.css';
import { Link } from 'react-router';

import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    button: {
        margin: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    errorMessage: {
        color: "red",
    }
});

class LoginForm extends React.Component {
    render() {
        const { classes } = this.props;
        const onChange = this.props.onChange;
        const onSubmit = this.props.onSubmit;
        const errors = this.props.errors;
        const user = this.props.user;
        return (
            <div className="panel">
                <div className={classes.root}>
                    <form onSubmit={onSubmit} action="/">
                        <Typography type="title" gutterBottom>
                            login
                        </Typography>
                        {errors.summary && <div className={classes.errorMessage}><p>{errors.summary}</p></div>}
                        <Grid justify="center" container spacing={0}>
                            <Grid item xs={4} sm={4}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="name-helper">Email address:</InputLabel>
                                    <Input id="name-helper" type="email" name="email" onChange={onChange} />
                                    <FormHelperText>Email address</FormHelperText>
                                </FormControl>
                                {errors.email && <div className={classes.errorMessage}><p>{errors.email}</p></div>}
                            </Grid>
                        </Grid>

                        <Grid justify="center" container spacing={0}>
                            <Grid item xs={4} sm={4}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="name-helper">Password</InputLabel>
                                    <Input id="name-helper" type="password" name="password" onChange={onChange} />
                                    <FormHelperText>Password</FormHelperText>
                                </FormControl>
                                {errors.password && <div className={classes.errorMessage}><p>{errors.password}</p></div>}
                            </Grid>
                        </Grid>

                        <Button type="submit" raised color="accent" className={classes.button} className="button">
                            submit
                        </Button>
                        <p> Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </form>
                </div>
            </div>

        );
    }
}

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};
export default withStyles(styles)(LoginForm);