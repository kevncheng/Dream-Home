import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

class Comments extends Component {
    render () {
        const { comment } = this.props;
        return (
            <>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={comment.user.profile} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={comment.user.name}
                        secondary={
                            <React.Fragment>
                                <div>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="gray"
                                        stye={{ fontSize: '8px' }}
                                    >
                                        {moment(comment.date).fromNow()}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="primary"
                                        stye={{ fontSize: '8px' }}
                                    >
                                        {comment.comment}
                                    </Typography>
                                </div>
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
            </>
        );
    }
}

export default Comments;
