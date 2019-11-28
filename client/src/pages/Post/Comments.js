import React, {Component} from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/postActions';

class Comments extends Component {
    renderDeleteSpan = () => {
        const { userStore: {user}, comment, deleteComment } = this.props;
        if(user._id === comment.user._id) {
            return (
                <span 
                    style = {{paddingLeft:'10px', color: 'rgb(0, 122, 255)', cursor: 'pointer'}}
                    onClick = {() => deleteComment(comment._id)}
                >
                    Delete
                </span>
            );
        }
    };
    
    render() {
        const {comment, history } = this.props;
        return (
            <div style = {{marginBottom: '5px'}}>
                <ListItem alignItems='flex-start' style = {{marginBottom: '10px'}}>
                    <ListItemAvatar style = {{cursor: 'pointer' }} onClick = {() => history.push(`/profile/${comment.user.username}`)}>
                        <Avatar alt='Remy Sharp' src={comment.user.profile} />
                    </ListItemAvatar>
                    <div>
                        <div>
                            <div style = {{fontWeight: 'bold'}}>
                                {comment.user.name}
                            </div>
                            <div style =  {{fontSize:'0.9rem', color:'gray'}}>
                                {moment(comment.date).fromNow()}
                                {this.renderDeleteSpan()}
                            </div>
                        </div>
                        <div style = {{marginTop: '5px'}}>
                            {comment.comment}
                        </div>
                    </div>
                </ListItem>
                <Divider variant='inset' component='li' />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
});

export default connect(mapStateToProps, {deleteComment})(Comments);
