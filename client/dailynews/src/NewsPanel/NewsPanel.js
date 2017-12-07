import './NewsPanel.css';
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import ListGroup from "react-bootstrap/lib/ListGroup";
import ListGroupItem from "react-bootstrap/lib/ListGroupItem";
import Grid from "react-bootstrap/lib/Grid";
import _ from 'lodash';

class NewsPanel extends React.Component {
  constructor() {
    super();
    this.state = { news: null };
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
    let request = new Request('http://localhost:3000/news', {
      method: 'GET',
      cache: false
    });

    fetch(request)
      .then((res) => res.json())
      .then((news) => {
        this.setState({
          news: this.state.news ? this.state.news.concat(news) : news,
        });
      });
  }
  renderNews() {
    const news_list = this.state.news.map(function (news) {
      return (
        <Grid>
          <ListGroupItem>
            <NewsCard news={news} />
          </ListGroupItem>
        </Grid>
      );
    });

    return (
      <ListGroup>
        {news_list}
      </ListGroup>
    )
  }

  render() {
    if (this.state.news) {
      return (
        <div>
          {this.renderNews()}
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

export default NewsPanel;
