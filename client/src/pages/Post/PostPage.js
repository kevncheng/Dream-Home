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
import { fetchPosts, fetchCurrentPost, fetchComments, postComment } from '../../actions/postActions';
import Comments from './Comments';
import _ from 'lodash';

const styles = theme => ({
    post: {
        marginBottom: theme.spacing(4)
    }
});

class PostPage extends React.Component {
    state = {
        id: this.props.match.params.id,
        board: '',
        comment: '',
        viewComments: false
    };

    componentDidMount () {
        this.props.fetchCurrentPost(this.props.match.params.id);
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
            commentsStore: { comments },
            history
        } = this.props;
        return comments.map((comment, i) => {
            return <Comments comment={comment} key={i} history = {history} />;
        });
    };

    onCommentPressed = async () => {
        const { match, postComment, fetchComments, userStore: { authenticated }, history } = this.props;
        try {
            if (authenticated) {
                await postComment(match.params.id, this.state.comment);
                await fetchComments(match.params.id);
                this.setState({comment: ''});
            } else if (!authenticated) {
                history.push('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    render () {
        const {
            classes,
            userStore: { authenticated, user },
            post
        } = this.props;
        if (post.postFound === null || post.loading) {
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
        if (!post.postFound && !post.loading) {
            return (
                <div>
                    <h1>No Post found</h1>
                </div>
            );
        };

        // console.log(this.props.commentsStore)
        return (
            <div>
                <div className={classes.post}>
                    <Post
                        handleSave={e => this.save(e)}
                        handleSelectBoard={this.handleChange}
                        value={this.state.board}
                        post={this.props.post}
                        boards={authenticated ? user.boards : []}
                        authenticated={authenticated}
                        favourites={user.favourites}
                    />
                </div>
                <Divider component={'hr'} />
                <div style = {{ margin: '10px'}}>
                    <h2>Comments</h2>
                    <div style = {{ display: this.state.viewComments ? 'block' : 'none', margin: '10px'}}>
                        <div style = {{paddingBottom: '20px'}}>
                            <TextField
                                id="outlined-multiline-static"
                                multiline
                                rows="4"
                                margin = 'normal'
                                placeholder = 'Write a comment'
                                variant="outlined"
                                value = {this.state.comment}
                                onChange = {e => this.setState({ comment: e.target.value })}
                                fullWidth
                            />

                            <div style = {{float: 'right', paddingBottom: '10px', zIndex: 1}}>
                                <Button 
                                    onClick = {() => this.onCommentPressed()}
                                    
                                >
                                Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                    {this.renderCommentLoading()}
                    <div style = {{width: '95%'}}>
                        {this.renderViewComments()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
    post: state.PostStore,
    commentsStore: state.CommentsStore
});

function mapDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            getBoardsandPosts,
            fetchPosts,
            fetchCurrentPost,
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
