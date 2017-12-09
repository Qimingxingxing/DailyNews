import './NewsPanel.css';
import React from 'react';
import "./NewsPanel.css";
import NewsCard from '../NewsCard/NewsCard';
import Auth from '../Auth/Auth';
import _ from 'lodash';
import { CircularProgress } from 'material-ui/Progress';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  progress: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  }
});

class NewsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { news: null, pageNum: 1, loadedAll: false };
  }
  componentDidMount() {
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    let scrollY = window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;
    if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
      this.loadMoreNews();
    }
  }

  loadMoreNews() {
    if (this.state.loadedAll === true) {
      return;
    }
    let url = 'http://localhost:3000/news/userId/' + Auth.getEmail()
      + '/pageNum/' + this.state.pageNum;

    let request = new Request(encodeURI(url), {
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + Auth.getToken(),
      },
      cache: false
    });

    fetch(request)
      .then((res) => res.json())
      .then((news) => {
        if (!news || news.length === 0) {
          this.setState({ loadedAll: true });
        }

        this.setState({
          news: this.state.news ? this.state.news.concat(news) : news,
          pageNum: this.state.pageNum + 1
        });
      });
  }


  renderNews() {
    const { classes } = this.props;

    const news_list = this.state.news.map(function (news) {
      return (
        <ListItem style={{ justifyContent: 'center' }}>
          <NewsCard news={news} />
        </ListItem>
      );
    });

    return (
      <List className={classes.root}>
        {news_list}
      </List>
    )
  }

  render() {
    const { classes } = this.props;
    if (this.state.news) {
      return (
        <div>
          {this.renderNews()}
          <CircularProgress className={classes.progress} style={{
            justifyContent: 'center', marginLeft: '50%'
          }} color="accent" />
        </div>
      );
    } else {
      return (
        <div>
          <div id='msg-app-loading'>
            Loading...
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(NewsPanel);