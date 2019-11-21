import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import BoardList from './BoardList';
import PostDetails from './PostDetails';
import { favouritePost } from '../../actions/profileActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles(theme => ({
    info: {
        padding: '3rem 0 1rem 3rem',
        width: '55%'
    },
    title: {
        padding: '1rem 0 1rem 0',
        fontWeight: 'bold'
    },
    image: {
        height: '60vh',
        width: 'auto',
        float: 'right',
        paddingRight: '3rem',
        zIndex: 3
    },
    favourite: {
        color: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        float: 'right',
        top: 20,
        right: 60,
        '&:hover': {
            color: 'rgba(246, 189, 10, 1)',
            cursor: 'pointer',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
        }
    },
    favourited: {
        color: 'rgba(246, 189, 10, 1)',
        cursor: 'pointer',
        position: 'absolute',
        float: 'right',
        top: 20,
        right: 60
    }
}));

const Post = ({
    post,
    boards,
    handleSelectBoard,
    handleSave,
    value,
    profileImage,
    authenticated,
    favouritePost,
    favourites,
    history
}) => {
    const classes = useStyles();
    const [favourited, setFavourite] = useState(favourites.indexOf(post._id) === -1);

    const onFavouritePress = () => {
        const isFavourited = favourited ? 'favourite' : 'unfavourite';
        if (authenticated) {
            favouritePost(post.user.username, post._id, isFavourited);
            setFavourite(!favourited);
        } else {
            history.push('/login');
        }
    };
    return (
        <Grid container direction="row" justify="center">
            <Grid item xs={6}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Tooltip title={favourited ? 'Favourite this post!' : 'Unfavourite this post'}>
                        <StarIcon
                            fontSize="large"
                            className={favourited ? classes.favourite : classes.favourited}
                            onClick={() => onFavouritePress()}
                        />
                    </Tooltip>

                    <img src={post.image} alt={post.title} className={classes.image} />
                </div>
            </Grid>
            <Grid item xs={6}>
                <div className={classes.info}>
                    <PostDetails
                        post={post}
                        profileImage={profileImage}
                        authenticated={authenticated}
                    />
                    <BoardList
                        boards={boards}
                        value={value}
                        handleSelect={handleSelectBoard}
                        handleSave={handleSave}
                        visible={authenticated}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

export default withRouter(
    connect(
        null,
        { favouritePost }
    )(Post)
);
