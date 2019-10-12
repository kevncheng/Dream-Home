/* eslint-disable camelcase */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { fetchPosts } from '../actions/postActions';

import queryString from 'query-string';
import _ from 'lodash';

import Posts from '../components/Posts/Posts';
import SnackBar from '../components/SnackBar/SnackBar';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import './stylesheet/Content.css';

class Search extends Component {
    state = {
        SnackBar: _.isEmpty(this.props.posts.posts)
    };

    componentDidMount = () => {
        const {
            location,
            fetchPosts
        } = this.props;
        const query = queryString.parse(location.search);
        const { search_filter = '', easy_filters = '', size = 20 } = query;
        fetchPosts(search_filter, easy_filters, '', size);
    };

    renderPosts = () => <Posts posts={this.props.posts.posts} />;

    renderEmptyError = () => {
        if (_.isEmpty(this.props.posts.posts)) {
            return (
                <SnackBar
                    message="There are no posts"
                    variant="error"
                    open={this.state.SnackBar}
                    onClose={() => this.setState({ SnackBar: false })}
                />
            );
        }
    };

    renderViewMore = () => {
        const {
            posts: { postsSize, posts }
        } = this.props;
        if (postsSize !== posts.length) {
            return <Button onClick={() => this.viewMore()}>View More</Button>;
        }
        return <div />;
    };

    viewMore = () => {
        const { location, history } = this.props;
        const query = queryString.parse(location.search);
        const { search_filter = '', easy_filters = '', size = 20 } = query;
        let params = '';
        if (search_filter) {
            params += `search_filter=${search_filter}`;
        }
        if (easy_filters) {
            params += `easy_filter=${easy_filters}`;
        }
        if (size) {
            if (params) {
                params += '&';
            }
            params += `size=${parseInt(size) + 10}`;
        }
        history.push(`/?${params}`);
    };

    render () {
        if (this.props.posts.loading) {
            return <CircularProgress className="spinner" />;
        }
        return (
            <div>
                <div className="placeholder" />
                <div>{this.renderPosts()}</div>
                <div>{this.renderEmptyError()}</div>
                <div style={{ textAlign: 'center', margin: '10px' }}>{this.renderViewMore()}</div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.posts,
    user: state.UserStore
});

export default connect(
    mapStateToProps,
    { fetchPosts }
)(Search);
