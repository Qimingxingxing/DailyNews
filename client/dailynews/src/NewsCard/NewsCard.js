import React from "react";
import "./NewsCard.css";
import { ButtonToolbar, Label, Button, Row, Col, Grid, Image, PageHeader } from "react-bootstrap";


class NewsCard extends React.Component {
    redirectToUrl = (url) => {
        window.open(this.props.news.url, "_blank");
    }
    render() {
        return (
            <Row className="show-grid" onClick={this.redirectToUrl}>
                <Col xs={6} md={4}>
                    <Image src={this.props.news.urlToImage} thumbnail />
                </Col>
                <Col xs={12} md={8}>
                    <h4>
                        {this.props.news.title}
                    </h4>
                    <div className="news-description">
                        <p className="news-description">{this.props.news.description}</p>
                        <div>
                            {this.props.news.source != null && <Label bsStyle="primary" className="label">{this.props.news.source}</Label>}
                            {this.props.news.reason != null && <Label bsStyle="info" className="label">{this.props.news.reason}</Label>}
                            {this.props.news.time != null && <Label bsStyle="danger" className="label">{this.props.news.time}</Label>}
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}
export default NewsCard;