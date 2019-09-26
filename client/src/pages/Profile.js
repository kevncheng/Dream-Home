import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SnackBar from '../components/SnackBar/SnackBar';
import { Card, Typography } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import BoardPreview from '../components/Posts/BoardPreview';
import { Route, Link, withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import InterestQuizDialog from '../components/Dialog/InterestQuizDialog/QuizDialog';
import PostDialog from '../components/Dialog/PostDialog/PostDialog';
import BoardDialog from '../components/Dialog/BoardDialog/BoardDialog';
import EditPicUserDialog from '../components/Dialog/EditPicUserDialog/EditPicUserDialog';
import Button from '@material-ui/core/Button';
import DeleteButton from '../components/Buttons/DeleteButton';
import {
    getBoardsandPosts,
    followUser,
    unfollowUser,
    fetchProfileInfo,
    clearError
} from '../actions/profileActions';
import Posts from '../components/Posts/Posts';
import _ from 'lodash';
import './stylesheet/Profile.css';
import Masonry from 'react-masonry-component';
import ProfilePic from '../components/Profile/ProfilePic';

class Profile extends Component {
    state = {
        username: '',
        activePanel: 'board',
        SnackBar: true
    };

    componentDidMount () {
        const username = this.props.match.params.username;
        this.setState({ username: username });
        this.props.fetchProfileInfo(username);
    }

    toggleTabs = item => {
        this.setState({ activePanel: `${item}` });
    };

    onCreatePress = item => {
        this.props.history.push(`/profile/${this.state.username}/${item}/create`);
    };

    onCreateBoardPress = () => {
        this.props.history.push(`/profile/${this.state.username}/board/create`);
    };

    onCreatePostPress = () => {
        this.props.history.push(`/profile/${this.state.username}/post/create`);
    };

    onFollowPress = () => {
        const {
            userStore: { authenticated, user },
            profileStore: { profileInfo },
            history,
            followUser
        } = this.props;
        const followee = profileInfo._id;
        const currentUserId = user._id;
        if (!authenticated) {
            history.push('/login');
        } else {
            followUser(followee, currentUserId);
            this.setState({ followedOrNot: !this.state.followedOrNot });
        }
    };

    onUnfollowPress = () => {
        const {
            userStore: { user },
            profileStore: { profileInfo },
            unfollowUser
        } = this.props;
        const currentUserId = user._id;
        const followee = profileInfo._id;
        unfollowUser(followee, currentUserId);
        this.setState({ followedOrNot: !this.state.followedOrNot });
    };

    checkFollowing = () => {
        const {
            userStore: { user },
            profileStore: {
                profileInfo: { followers }
            }
        } = this.props;
        const res = _.filter(followers, follower => follower._id === user._id);
        return _.isEmpty(res);
    };

    renderFollowButton = () => {
        return this.checkFollowing() ? (
            <Button className="followButton" color="primary" onClick={() => this.onFollowPress()}>
                Follow!
            </Button>
        ) : (
            <Button
                className="followButton"
                color="primary"
                variant={'contained'}
                onClick={() => this.onUnfollowPress()}
            >
                Stop Following!
            </Button>
        );
    };

    renderBoards = () => {
        const { boards } = this.props.profileStore.profileInfo;
        return boards.length === 0 ? (
            <h2>There are no boards</h2>
        ) : (
            boards.map((board, i) => {
                return (
                    <Card key={i} className="card">
                        <Link
                            to={{ pathname: `/board/${board._id}`, state: { board } }}
                            className="boardLink"
                        >
                            <CardActionArea>
                                <BoardPreview posts={board.posts} className="boardPreview" />
                            </CardActionArea>
                        </Link>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr'
                            }}
                        >
                            <div>
                                <Typography variant="h6" className="cardHeader">
                                    {board.title}
                                </Typography>
                                <Typography variant="body1" className="cardHeader">
                                    {board.posts.length} posts
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    alignContent: 'center',
                                    justifyContent: 'end'
                                }}
                            >
                                <DeleteButton item="boards" id={board._id} title={board.title} />
                            </div>
                        </div>
                    </Card>
                );
            })
        );
    };

    renderPosts = () => {
        const {
            profileStore: {
                profileInfo: { posts }
            },
            userStore: { user }
        } = this.props;
        return posts.length === 0 ? (
            <h2 style={{ textAlign: 'center' }}>There are no posts</h2>
        ) : (
            <div style={{ width: '100vw' }}>
                <Posts posts={posts} deleteAuth={true} user={user._id} />
            </div>
        );
    };

    renderFavorites = () => {
        const favoritePosts = [];
        const favorites = favoritePosts.map(function (el) {
            return <img className="favoritePost" alt="" src={el} key={el} />;
        });
        return favoritePosts.length === 0 ? (
            <h2>You have no favorite posts</h2>
        ) : (
            <Masonry
                className="masonry"
                elementType={'div'}
                options={{ fitWidth: true, gutter: 15 }}
            >
                {favorites}
            </Masonry>
        );
    };

    renderCreateButtons = () => {
        const {
            userStore: { user, authenticated },
            profileStore: { profileInfo }
        } = this.props;
        if (authenticated) {
            if (profileInfo._id !== user._id) {
                // return <>{this.renderFollowButton()}</>;
                return <div />;
            }
        } else if (!authenticated) {
            return <div />;
        }
        return (
            <>
                <Button
                    color="primary"
                    onClick={() => this.onCreatePress('board')}
                    style={{
                        margin: '10px'
                    }}
                >
                    Create Board
                </Button>
                <Button
                    color="primary"
                    variant={'contained'}
                    onClick={() => this.onCreatePress('post')}
                    style={{
                        margin: '10px 25px 10px 10px'
                    }}
                >
                    Create Post
                </Button>
            </>
        );
    };

    renderSnackBarError = () => {
        const {
            profileStore: { error },
            clearError
        } = this.props;
        if (!_.isEmpty(error)) {
            return (
                <SnackBar
                    message={error.message}
                    variant={error.status}
                    open={!_.isEmpty(error)}
                    onClose={() => {
                        this.setState({ SnackBar: false });
                        clearError();
                    }}
                />
            );
        }
    };

    isCurrentUser = () => {
        const {
            profileStore: { profileInfo },
            userStore
        } = this.props;
        if (!userStore.authenticated) {
            return false;
        } else if (userStore.user._id === profileInfo._id) {
            return true;
        }
        return false;
    };

    render () {
        const {
            profileStore: { profileInfo, loading }
        } = this.props;
        if (_.isUndefined(profileInfo) || loading) {
            return <CircularProgress className="spinner" />;
        }
        return (
            <div>
                <Route path="/profile/:username/edit" component={EditPicUserDialog} />
                <Route path="/profile/:username/interest-quiz" component={InterestQuizDialog} />
                <Route
                    path="/profile/:username/post/create"
                    render={props => <PostDialog key={props.match.params.username} {...props} />}
                />
                <Route path="/profile/:username/board/create" component={BoardDialog} />
                <div className="subHeader">
                    <div className="nameContainer">
                        <ProfilePic
                            profile={profileInfo.profile}
                            username={profileInfo.username}
                            className = {this.isCurrentUser() ? 'profilePic' : '' }
                            isCurrentUser={this.isCurrentUser()}
                        />
                        <div>
                            <h3 className="profileName">{profileInfo.name}</h3>
                            {/* <h5 className="profileFollowers">
                                {profileInfo.followers} Followers |{' '}
                                {profileInfo.following} Following
                            </h5> */}
                        </div>
                    </div>
                    <div />
                    <div>{this.renderCreateButtons()}</div>
                </div>
                <div style={{ display: this.state.activePanel === 'board' ? 'grid' : 'none' }}>
                    <div className="tabSection">
                        <div>
                            <Button
                                color="primary"
                                variant={'contained'}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Boards
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => this.toggleTabs('post')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Posts
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => this.toggleTabs('favorite')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Favorites
                            </Button>
                        </div>
                        <div />
                    </div>
                    <div className="activePanel">
                        <div
                            className={
                                profileInfo.boards.length === 0 ? 'gridContainer1' : 'gridContainer'
                            }
                        >
                            {this.renderBoards()}
                        </div>
                    </div>
                </div>
                <div style={{ display: this.state.activePanel === 'post' ? 'grid' : 'none' }}>
                    <div className="tabSection">
                        <div>
                            <Button
                                color="primary"
                                onClick={() => this.toggleTabs('board')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Boards
                            </Button>
                            <Button
                                color="primary"
                                variant={'contained'}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Posts
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => this.toggleTabs('favorite')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Favorites
                            </Button>
                        </div>
                        <div />
                    </div>
                    <div className="Panel">
                        <div
                            className={
                                profileInfo.posts.length === 0 ? 'postContainer1' : 'postContainer'
                            }
                        >
                            <div
                                style={{
                                    width: '90vw'
                                }}
                            >
                                {this.renderPosts()}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: this.state.activePanel === 'favorite' ? 'grid' : 'none' }}>
                    <div className="tabSection">
                        <div>
                            <Button
                                color="primary"
                                onClick={() => this.toggleTabs('board')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Boards
                            </Button>
                            <Button
                                id="post"
                                color="primary"
                                onClick={() => this.toggleTabs('post')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Posts
                            </Button>
                            <Button
                                color="primary"
                                variant={'contained'}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Favorites
                            </Button>
                        </div>
                        <div />
                    </div>
                    <div className="activePanel">{this.renderFavorites()}</div>
                </div>
                {this.renderSnackBarError()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
    profileStore: state.ProfileStore
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            getBoardsandPosts,
            followUser,
            unfollowUser,
            fetchProfileInfo,
            clearError
        },
        dispatch
    );
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Profile);
