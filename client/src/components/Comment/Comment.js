import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import CommentBox from '../Comment/CommentBox';
import { connect } from 'react-redux';
import { deleteComment, replyComment, fetchComments } from '../../actions/postActions';

class Comment extends React.Component {
    state = {
        reply: '',
        replyVisible: false
    }

    onChangeText = e => {
        this.setState({ reply: e.target.value });
    }

    renderDeleteSpan = () => {
        const { user, comment, deleteComment, reply } = this.props;
        if (user._id === comment.user._id) {
            return (
                <span
                    style = {{ paddingLeft: '10px', color: 'rgb(0, 122, 255)', cursor: 'pointer' }}
                    onClick = {() => deleteComment(comment._id, reply)}
                >
                    Delete
                </span>
            );
        }
    };

    onDeletePress = (commentID, reply) => {
        const { deleteComment, fetchComments, postID } = this.props;
        deleteComment(commentID, reply);
        fetchComments(postID);
    }

    onPressReply = () => {
        const { authenticated } = this.props;
        if (authenticated) {
            return this.setState({ replyVisible: !this.state.replyVisible });
        }
        return console.log('not logged in');
    }

    onSubmitReply = () => {
        const { replyComment, comment, user, authenticated } = this.props;
        if (authenticated) {
            replyComment(comment._id, this.state.reply, user);
            this.setState({ reply: '', replyVisible: false });
        } else {
            console.log('Please log in');
        }
    }

    onRenderReplyBox = () => {
        return this.state.replyVisible
            ? <CommentBox
                comment = { this.state.reply }
                onChangeText = { this.onChangeText }
                onCommentPressed = { this.onSubmitReply }
                indent = { this.props.indent }
            />
            : <div style = {{ display: 'none' }}/>;
    }

    onRenderReply = () => {
        const { reply = false } = this.props;
        if (!reply) {
            return (
                <span
                    style = {{ paddingLeft: '10px', color: 'rgb(0, 122, 255)', cursor: 'pointer' }}
                    onClick = {() => this.onPressReply()}
                >
            Reply
                </span>
            );
        }
    }

    render () {
        const { comment, history, indent } = this.props;
        return (
            <div stlye = {{ display: 'flex' }}>
                <ListItem alignItems='flex-start' style = {{ marginBottom: '10px', marginLeft: indent }}>
                    <ListItemAvatar
                        style = {{ cursor: 'pointer' }}
                        onClick = {() => history.push(`/profile/${comment.user.username}`)}
                    >
                        <Avatar alt='Remy Sharp' src={comment.user.profile} />
                    </ListItemAvatar>
                    <div>
                        <div>
                            <div style = {{ fontWeight: 'bold' }}>
                                {comment.user.name}
                            </div>
                            <div style = {{ fontSize: '0.9rem', color: 'gray' }}>
                                {moment(comment.date).fromNow()}
                                {this.onRenderReply()}
                                {this.renderDeleteSpan()}
                            </div>
                        </div>
                        <div style = {{ marginTop: '5px' }}>
                            {comment.comment}
                        </div>
                    </div>
                </ListItem>
                {this.onRenderReplyBox()}
            </div>
        );
    }
}

export default connect(null, { deleteComment, replyComment, fetchComments })(Comment);
