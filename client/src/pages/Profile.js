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
import { followUser, unfollowUser, fetchProfileInfo, clearError } from '../actions/profileActions';
import Posts from '../components/Posts/Posts';
import _ from 'lodash';
import './stylesheet/Profile.css';
import ProfilePic from '../components/Profile/ProfilePic';

class Profile extends Component {
    state = {
        username: '',
        activePanel: 'boards',
        SnackBar: true
    };

    componentDidMount () {
        const {
            fetchProfileInfo,
            userStore: { user },
            match: { params }
        } = this.props;
        const username = params.username;
        this.setState({ username: username });
        fetchProfileInfo(username, user.username);
    }

    toggleTabs = item => {
        this.setState({ activePanel: `${item}` });
    };

    onCreatePress = item => {
        this.props.history.push(`/profile/${this.state.username}/${item}/create`);
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

    renderFavourites = () => {
        const {
            profileStore: {
                profileInfo: { favourites }
            },
            userStore: { user }
        } = this.props;
        return favourites.length === 0 ? (
            <h2 style={{ textAlign: 'center' }}>There are no favourites</h2>
        ) : (
            <div style={{ width: '100vw' }}>
                <Posts posts={favourites} deleteAuth={false} user={user._id} />
            </div>
        );
    };

    renderFavouritesButton = () => {
        if (this.props.profileStore.isCurrentUser) {
            return (
                <Button
                    color="primary"
                    variant={this.state.activePanel === 'favourites' ? 'contained' : 'text'}
                    onClick={() => this.toggleTabs('favourites')}
                    style={{
                        margin: '10px'
                    }}
                >
                    Favourites
                </Button>
            );
        }
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

    renderActiveTab = () => {
        switch (this.state.activePanel) {
        case 'boards':
            return this.renderBoards();
        case 'posts':
            return this.renderPosts();
        case 'favourites':
            return this.renderFavourites();
        default:
            return this.renderBoards();
        }
    };

    render () {
        const {
            profileStore: { profileInfo, loading, isCurrentUser }
        } = this.props;
        const { activePanel } = this.state;
        if (_.isUndefined(profileInfo) || loading) {
            return <CircularProgress className="spinner" />;
        }
        console.log(isCurrentUser);
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
                            className={isCurrentUser ? 'profilePic' : 'text'}
                            isCurrentUser={isCurrentUser}
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
                <div style={{ display: 'grid' }}>
                    <div className= {isCurrentUser ? 'tabSectionCurrent' : 'tabSection'}>
                        <div>
                            <Button
                                color="primary"
                                variant={activePanel === 'boards' ? 'contained' : 'text'}
                                onClick={() => this.toggleTabs('boards')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Boards
                            </Button>
                            <Button
                                color="primary"
                                variant={activePanel === 'posts' ? 'contained' : 'text'}
                                onClick={() => this.toggleTabs('posts')}
                                style={{
                                    margin: '10px'
                                }}
                            >
                                Posts
                            </Button>
                            {this.renderFavouritesButton()}
                        </div>
                        <div />
                    </div>
                    <div className="activePanel">
                        <div
                            className={
                                profileInfo[activePanel].length === 0
                                    ? 'gridContainer1'
                                    : 'gridContainer'
                            }
                        >
                            {this.renderActiveTab()}
                        </div>
                    </div>
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
