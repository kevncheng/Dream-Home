import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import face from '../../assets/face.jpg';
import Button from '@material-ui/core/Button';
import moment from 'moment';

import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { favouritePost } from '../../actions/profileActions';

const useStyles = makeStyles(theme => ({
    author: {
        marginTop: '1rem'
    },
    avatar: {
        display: 'inline-block',
        margin: 10,
        width: 25,
        height: 25
    },
    title: {
        padding: '1rem 0 1rem 0',
        fontWeight: 'bold'
    },
    date: {
        fontSize: 10,
        marginBottom: '1rem',
        fontStyle: 'oblique'
    }
}));

const PostDetails = ({ post, history, favouritePost, authenticated, match }) => {
    const classes = useStyles();
    const placeholder = 'https://team-pineapple.s3.ca-central-1.amazonaws.com/placeholder.jpg';

    const onFavouritePress = () => {
        favouritePost(post.user.username, match.params.id);
    };

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={4}
                className={classes.author}
                onClick={() => history.push(`/profile/${post.user.username}`)}
                style={{ cursor: 'pointer' }}
            >
                <Avatar
                    src={post.user.profile || placeholder}
                    alt={face}
                    component={'div'}
                    className={classes.avatar}
                />
                <Typography className={classes.user}>{post.user.name}</Typography>
            </Grid>
            <Grid className={classes.content}>
                <Typography
                    variant="h5"
                    component="h5"
                    className={classes.title}>
                    {post.title}
                </Typography>
                <Typography className={classes.text}>{post.description}</Typography>
                <p className={classes.date}>{moment(post.date).format('MMMM Do YYYY, h:mm a')}</p>
                {
                    authenticated
                        ? <Button className={classes.favorite} onClick={() => onFavouritePress()}>Favorite This Post!</Button>
                        : null
                }
            </Grid>
        </div>
    );
};

export default compose(
    withRouter,
    connect(
        null,
        { favouritePost }
    )
)(PostDetails);
