import React from 'react';
import { withStyles } from '@material-ui/styles';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Post from './Post';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import { getBoardsandPosts } from '../../actions/profileActions';
import { boardService } from '../../services/board';
import { fetchPosts, fetchComments, postComment } from '../../actions/postActions';
import Comments from './Comments';
import _ from 'lodash';

const styles = theme => ({
    post: {
        marginBottom: theme.spacing(4)
    }
});

class PostPage extends React.Component {
    state = {
        id: '',
        board: '',
        comment: '',
        viewComments: false
    };

    componentDidMount () {
        const id = this.props.match.params.id;
        this.setState({ id });
        if (!this.props.post(id)) {
            this.props.fetchPosts('', '', '');
        }
        // this.props.fetchComments(id);
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

    renderCommentLoading = () => {
        const {
            commentsStore: { loading, comments }
        } = this.props;
        if (loading && _.isEmpty(comments)) {
            return <CircularProgress />;
        }
    };

    onViewPressed = () => {
        const { match, fetchComments } = this.props;
        fetchComments(match.params.id);
        this.setState({ viewComments: true });
    }

    renderViewComments = () => {
        const { viewComments } = this.state;
        if (viewComments) {
            return <List>{this.renderComments()}</List>;
        }
        return (
            <Button onClick={() => this.onViewPressed()}>
                View or Post Comments
            </Button>
        );
    }

    renderComments = () => {
        const {
            commentsStore: { comments }
        } = this.props;
        return comments.map((comment, i) => {
            return <Comments comment={comment} key={i} />;
        });
    };

    onCommentPressed = async () => {
        const { match, postComment, fetchComments } = this.props;
        try {
            await postComment(match.params.id, this.state.comment);
            await fetchComments(match.params.id);
        } catch (error) {
            console.log(error);
        }
    };

    render () {
        const {
            classes,
            userStore: { authenticated, user },
            post,
            match,
            commentsStore
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
                        }}
                    />
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
        // console.log(commentsStore)
        // console.log(user)
        console.log(this.props.posts);
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
                        favourites={user.favourites}
                    />
                </div>
                <Divider component={'hr'} />
                <div className={classes.more}>
                    <h2>Comments</h2>
                    <div style = {{ display: this.state.viewComments ? 'block' : 'none' }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Write a Comment"
                            multiline
                            rows="4"
                            defaultValue="Default Value"
                            className={classes.textField}
                            variant="outlined"
                            value = {this.state.comment}
                            onChange = {e => this.setState({ comment: e.target.value })}
                            fullWidth
                            style = {{ marginRight: '10px', marginLeft: '10px' }}
                        />
                        <Button style = {{ float: 'right' }}onClick = {() => this.onCommentPressed()}>Comment!</Button>
                    </div>
                    
                    {this.renderCommentLoading()}
                    {this.renderViewComments()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
    post: id => {
        if (!_.isEmpty(state.posts.posts) || state.UserStore.authenticated) {
            return (
                state.posts.posts.find(post => id === post._id) ||
                state.UserStore.user.posts.find(post => id === post._id)
            );
        }
    },
    posts: state.posts,
    commentsStore: state.CommentsStore
});

function mapDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            getBoardsandPosts,
            fetchPosts,
            fetchComments,
            postComment
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
