import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Masonry from 'react-masonry-component';
// import placeholder from '../../assets/image_placeholder.png';
// const Slideshow = require('react-slidez');

const useStyles = makeStyles(theme => ({
    imageContainer: {
        display: 'inline-block',
        // margin: '0 auto',
        width: '30%'
    },
    image: {
        display: 'block',
        width: '100%',
        height: 'auto',
        borderRadius: '5%'
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

    const images = () => {
        if (posts.length > 0) {
            const images = posts.slice(0, 9).map((post, i) => {
                return (
                    <div style={{ margin: '0 auto', width: `${imageSizing()}` }} key={i}>
                        <img src={post.image} alt={post._id} className={classes.image} />
                    </div>
                );
            });
            return images;
        }
    };

    const imageSizing = () => {
        if (100 / posts.length < 33) {
            return '33%';
        }
        return `${100 / posts.length}%`;
    };

    const renderImagePreview = () => {
        if (posts.length > 0) {
            return (
                <Masonry
                    className={classes.masonry}
                    options={{ fitWidth: true, transitionDuration: 0 }}
                    disableImagesLoaded={false}
                    updateOnEachImageLoad={true}
                    // imagesLoadedOptions={{}}
                >
                    {images()}
                </Masonry>
            );
        }
        return (
            <h3 style={{ textAlign: 'center', color: 'gray', margin: 'auto 0' }}>
                There are no posts
            </h3>
        );
    };
    return <div className={className}>{renderImagePreview()}</div>;
};

export default BoardPreview;
