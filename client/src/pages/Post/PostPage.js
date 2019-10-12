import React from 'react';
import { withStyles } from '@material-ui/styles';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Post from './Post';
import MorePosts from './MorePosts';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getBoardsandPosts } from '../../actions/profileActions';
import { boardService } from '../../services/board';
import { fetchPosts } from '../../actions/postActions';

const styles = theme => ({
    post: {
        marginBottom: theme.spacing(4)
    },
    more: {
        marginTop: theme.spacing(4)
    }
});

class PostPage extends React.Component {
    state = {
        id: '',
        board: ''
    };

    componentDidMount () {
        const id = this.props.match.params.id;
        this.setState({ id });
        if (!this.props.post(id)) {
            this.props.fetchPosts('', '', '');
        }
    }

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({ [name]: value });
    };

    save = async e => {
        e.preventDefault();
        try {
            await boardService.addPost({
                post: this.state.id,
                board: this.state.board
            });
        } catch (err) {
            console.log(err.response);
        }
    };

    render () {
        const {
            classes,
            userStore: { authenticated, user },
            post,
            morePosts,
            match
        } = this.props;
        if (!post(match.params.id)) {
            return (
                <div>
                    <CircularProgress
                        style={{
                            position: 'absolute',
                            top: '0',
                            bottom: '0',
                            right: '0',
                            left: '0',
                            margin: 'auto'
                        }}/>
                </div>
            );
        }

        if (!post(match.params.id)) {
            return (
                <div>
                    <h1>No Post found</h1>
                </div>
            );
        }

        return (
            <div>
                <div className={classes.post}>
                    <Post
                        handleSave={e => this.save(e)}
                        handleSelectBoard={this.handleChange}
                        value={this.state.board}
                        post={post(match.params.id)}
                        boards={authenticated ? user.boards : []}
                        authenticated={authenticated}
                        favourites = {user.favourites}
                    />
                </div>
                <Divider component={'hr'} />
                <div className={classes.more}>
                    <MorePosts posts={morePosts} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
    post: id => {
        if (state.posts.posts.length || state.UserStore.authenticated) {
            return (
                state.posts.posts.find(post => id === post._id) ||
                state.UserStore.user.posts.find(post => id === post._id)
            );
        }
    },
    morePosts: state.PostStore.morePosts
});

function mapDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            getBoardsandPosts,
            fetchPosts
        },
        dispatch
    );
}

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(PostPage);
