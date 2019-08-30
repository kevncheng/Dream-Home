import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import Posts from '../../components/Posts/Posts';

const useStyles = makeStyles(theme => ({
    title: {
        padding: '1rem 0 2rem 0',
        fontWeight: 'bold'
    }
}));

const MorePosts = ({ posts }) => {
    const classes = useStyles();

    return (
        <div>
            <Grid container direction="row" justify="center" alignItems="center">
                <Typography variant="h5" component="h5" className={classes.title}>More Like this</Typography>
            </Grid>
            <div>
                <Posts posts={posts}/>
            </div>
        </div>
    );
};

export default MorePosts;
