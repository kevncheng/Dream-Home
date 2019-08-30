import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Masonry from 'react-masonry-component';
import placeholder from '../../assets/image_placeholder.png';

const useStyles = makeStyles(theme => ({
    imageContainer: {
        // display: 'inline-block',
        width: '33%'
    },
    image: {
        display: 'block',
        width: '100%',
        height: 'auto',
        borderRadius: '1vw'
    },
    masonry: {
        margin: '0 auto',
        position: 'relative',
        textAlign: 'center',
        color: 'white'
    }
}));

const BoardPreview = ({ posts, className }) => {
    const classes = useStyles();
    const len = posts.length;

    for (let i = 0; i < 9 - len; i++) {
        posts.push({ image: placeholder, _id: `placeholder${i}` });
    }

    const images = posts.map((post, i) => {
        return (
            <div className={classes.imageContainer} key={i}>
                <img src={post.image} alt={post._id} className={classes.image}/>
            </div>
        );
    });

    return (
        <div className={className}>
            <Masonry
                className={classes.masonry}
                options={{ fitWidth: true }}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                imagesLoadedOptions={{}}
            >
                {images}
            </Masonry>
        </div>
    );
};

export default BoardPreview;
