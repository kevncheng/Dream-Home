import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { deleteComment, replyComment, fetchComments } from '../../actions/postActions';
import Comment from '../../components/Comment/Comment';

class CommentList extends Component {
    renderReplies = () => {
        const { comment: { childComments = [] }, history, userStore: { authenticated, user }, replyComment, postID } = this.props;
        if (childComments.length > 0) {
            return childComments.map((comment, i) => {
                return (
                    <Comment
                        key = { i }
                        history = { history }
                        comment = { comment }
                        onPressReply = { this.onPressReply }
                        replyComment = { replyComment }
                        authenticated = { authenticated }
                        postID = { postID }
                        user = { user }
                        indent = '30px'
                        reply = { true }
                    />
                );
            });
        }
    }

    render () {
        const { comment, history, postID, userStore: { authenticated, user } } = this.props;
        return (
            <div style = {{ marginBottom: '5px' }}>
                <Comment
                    history = { history }
                    comment = { comment }
                    onPressReply = { this.onPressReply }
                    replyComment = { replyComment }
                    authenticated = { authenticated}
                    postID = { postID }
                    user = { user }
                />
                {this.renderReplies()}
                <Divider variant='inset' component='div' />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore
});

export default connect(mapStateToProps, { deleteComment, replyComment, fetchComments })(CommentList);
