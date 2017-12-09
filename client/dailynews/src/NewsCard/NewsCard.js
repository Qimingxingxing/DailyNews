import React from "react";
import "./NewsCard.css";
import Auth from '../Auth/Auth';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import IconButton from 'material-ui/IconButton';
import classnames from 'classnames';
import Collapse from 'material-ui/transitions/Collapse';
import LazyLoad from 'react-lazy-load';
import Chip from 'material-ui/Chip';
const styles = theme => ({
    card: {
        maxWidth: 800,
    },
    media: {
        height: 400,
        width: 800
    },
    chip: {
        margin: theme.spacing.unit,
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    flexGrow: {
        flex: '1 1 auto',
    },
    row: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

class NewsCard extends React.Component {
    redirectToUrl = (url) => {
        this.sendClickLog();
        window.open(this.props.news.url, "_blank");
    }

    state = { expanded: false };

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    sendClickLog() {
        let url = 'http://0.0.0.0:3000/news/userId/' + Auth.getEmail()
            + '/newsId/' + this.props.news.digest;

        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: false
        });

        fetch(request);
    }

    render() {
        const { classes } = this.props;
        console.log(this.props.news);
        return (
            <div>
                <Card style={{ textAlign: 'justify' }} className={classes.card}>
                    <LazyLoad>
                        <CardMedia
                            className={classes.media}
                            image={this.props.news.urlToImage}
                            title="Contemplative Reptile"
                        />
                    </LazyLoad>

                    <CardContent>
                        <Typography type="headline" component="h3">
                            {this.props.news.title}
                        </Typography>
                        <br />
                        <Typography component="p">
                            {this.props.news.description}
                        </Typography>
                    </CardContent>
                    <div className={classes.row}>
                        {this.props.news.source != null && <Chip label={this.props.news.source} className={classes.chip} style={{ color: "white", backgroundColor: "#81D4FA" }} />}
                        {this.props.news.reason != null && <Chip label={this.props.news.reason} className={classes.chip} style={{ color: "white", backgroundColor: "red" }} />}
                        {this.props.news.class != null && <Chip label={this.props.news.class} className={classes.chip} style={{ color: "white", backgroundColor: "#FF8F00" }} />}
                    </div>

                    <CardActions>
                        <Button dense color="accent" onClick={() => this.redirectToUrl(this.props.news.url)}>
                            View Source Page
                        </Button>
                        <div className={classes.flexGrow} />
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>

                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                {this.props.news.text}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </div>
        );
    }
}
export default withStyles(styles)(NewsCard);