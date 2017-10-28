import React from "react";
import "./NewsCard.css";
class NewsCard extends React.Component {
    handleClick = (url) => {
        window.open(url, "_blank");
    }
    render() {
        return (
            <div className="news-container" onClick={this.handleClick}>
                <div className="row">
                    <div className="col-md-4 fill">
                        <img className="img-responsive" src={this.props.news.urlToImage} alt='news' />
                    </div>
                    <div className="col-md-8">
                        <div className="news-intro-col">
                            <div className="news-intro-panel">
                                <h3>{this.props.news.title}</h3>
                                <div className="news-description">
                                    <p className="text-warning">{this.props.news.description}</p>
                                    <div>
                                        {this.props.news.source != null && <span className='label label-default'>{this.props.news.source}</span>}
                                        {this.props.news.reason != null && <span className='label label-primary'>{this.props.news.reason}</span>}
                                        {this.props.news.time != null && <span className='label label-success'>{this.props.news.time}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default NewsCard;