/* eslint-disable camelcase */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { fetchPosts } from '../actions/post';

import queryString from 'query-string';
import _ from 'lodash';

import Posts from '../components/Posts/Posts';
import SnackBar from '../components/SnackBar/SnackBar';
import { CircularProgress } from '@material-ui/core';
// import Button from '@material-ui/core/Button';

import './stylesheet/Content.css';

class Search extends Component {
    state = {
        SnackBar: _.isEmpty(this.props.posts.posts)
    }

    componentDidMount = () => {
        const { location, fetchPosts, user: { authenticated, user } } = this.props;
        const query = queryString.parse(location.search);
        const { search_filter = '', easy_filters = '' } = query;
        if (authenticated) {
            const { _id = '' } = user;
            fetchPosts(search_filter, easy_filters, _id);
        } else {
            fetchPosts(search_filter, easy_filters, '');
        }
    };

    renderPosts = () => <Posts posts={this.props.posts.posts} />;

    renderEmptyError = () => {
        if (_.isEmpty(this.props.posts.posts)) {
            return (
                <SnackBar
                    message='There are no posts'
                    variant='error'
                    open={this.state.SnackBar}
                    onClose = {() => this.setState({ SnackBar: false })}
                />
            );
        }
    };

    render () {
        if (this.props.posts.loading) {
            return <CircularProgress className = 'spinner'/>;
        };
        // console.log(this.props.user)
        return (
            <div>
                <div className='placeholder' />
                {/* <div className='buttonmenu'>
                    <div className='buttongrid'>
                        <Button className='option'>Cozy</Button>
                        <Button className='option'>Bohemian</Button>
                        <Button className='option'>Contemporary</Button>
                        <Button className='option'>Eclectic</Button>
                        <Button className='option'>Boho</Button>
                        <Button className='option'>Traditional</Button>
                        <Button className='option'>Simple</Button>
                    </div>
                </div> */}
                <div>
                    {this.renderPosts()}
                </div>
                <div>
                    {this.renderEmptyError()}
                </div>
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
