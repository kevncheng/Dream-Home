import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { getBoardsandPosts, addPost, createPost } from '../../../actions/profileActions';
import { createFormData } from '../../../services/utils';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogTitle } from '../components';
import FormContent from './FormContent';
import SnackBar from '../../SnackBar/SnackBar';
import FileUploader from './FileUploader';
import BoardList from './BoardList';
import { Chip } from '@material-ui/core';

import '../../../pages/stylesheet/Dialog.css';

class PostDialog extends React.Component {
    state = {
        title: '',
        description: '',
        descriptionError: '',
        link: '',
        linkError: '',
        tag: '',
        tags: [],
        tagError: '',
        titleError: '',
        board: '',
        image: [],
        imageError: '',
        SnackBar: false
    };

    componentDidMount = async () => {
        const username = this.props.match.params.username;
        if (!this.props.userStore.boards) {
            getBoardsandPosts(username);
        }
        this.setState({ username });
    };

    onChangeText = e => {
        this.setState({ [e.target.id]: e.target.value, [`${e.target.id}Error`]: '' });
    };

    // Board
    handleSelectChange = e => {
        this.setState({ board: e.target.value });
    };

    // Create a tag
    onSubmitPress = e => {
        const { tags, tag } = this.state;
        if (e.which === 13) {
            if (_.includes(_.lowerCase(tags), _.lowerCase(tag))) {
                this.setState({ tagError: 'Can not have duplicate tags' });
            } else if (tag.length > 15) {
                this.setState({ tagError: 'Tags cannot be more than 15 characters' });
            } else {
                this.setState({
                    tags: [...tags, tag.trim()],
                    tag: '',
                    tagError: ''
                });
            }
        }
    };

    renderTags = () => {
        return (
            <>
                {this.state.tags.map((tag, i) => {
                    return (
                        <Chip
                            key={i}
                            label={tag}
                            onDelete={() => this.onDeleteTag(tag)}
                            style={{ margin: 2 }}
                            size="small"
                            variant="outlined"
                            className="chip"
                        />
                    );
                })}
            </>
        );
    };

    onDeleteTag = tag => {
        this.setState({ tags: _.without(this.state.tags, tag) });
    };

    // File pond , handle image upload
    onUploadImages = fileItems => {
        const filterFiles = fileItems.filter(
            fileItem => fileItem.file.type.toString() === 'image/jpeg'
        );
        this.setState({ image: filterFiles.map(filterFile => filterFile.file) });
    };

    renderSmallText = () => {
        if (_.isEmpty(this.state.image)) {
            return (
                <div className="smallText">
                    <div style={{ textAlign: 'center', fontSize: 14 }}>
                        {/* <h1 style={{ fontSize: 14 }}>Maximum 5 files</h1> */}
                        Use high-quality jpg files <br /> less than 32mb
                    </div>
                </div>
            );
        }
    };

    // Create post
    onCreatePress = e => {
        const {
            title,
            link,
            description,
            username,
            image,
            board,
            tags,
            titleError,
            linkError,
            descriptionError
        } = this.state;
        e.preventDefault();
        if (image.length < 1) {
            this.setState({ imageError: 'Please include atleast one image', SnackBar: true });
        }
        if (title.length < 3 || title.length > 15) {
            this.setState({ titleError: 'Must be atleast 3 or less than 15 characters' });
        }
        if (link.length < 3 || link.length > 15) {
            this.setState({ linkError: 'Must be atleast 3 or less than 15 characters' });
        }
        if (description.length < 3 || description.length > 200) {
            this.setState({ descriptionError: 'Must be atleast 3 to 200 characters' });
        } else if (image.length > 0 && !titleError && !linkError && !descriptionError) {
            console.log(image);
            const formData = createFormData({ title, link, description, image: image[0], tags });
            // image.forEach(file => formData.append('image', file));
            this.props.createPost(formData, username, board);
            this.onCloseClick();
        }
    };

    onCloseClick = () => {
        this.props.history.push(`/profile/${this.state.username}`);
    };

    render () {
        const {
            userStore,
            match: { params }
        } = this.props;

        const {
            title,
            description,
            descriptionError,
            link,
            linkError,
            tag,
            tagError,
            titleError,
            board,
            image,
            imageError
        } = this.state;

        // Redirect user to profile if not authorized
        if (userStore.authenticated) {
            if (userStore.user.username !== params.username) {
                const redirect = `/profile/${params.username}`;
                return <Redirect to={redirect} />;
            }
        }
        return (
            <Dialog
                open={true}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                onClick={() => this.onCloseClick()}
            >
                <div onClick={e => e.stopPropagation()}>
                    <DialogTitle
                        style={{ textAlign: 'center' }}
                        id="form-dialog-title"
                        onClose={this.onCloseClick}
                    >
                        Create a post
                    </DialogTitle>
                    <div className="container">
                        <div className="splitContainer">
                            <DialogContent>
                                <BoardList
                                    className="boardList"
                                    boards={this.props.profileStore.profileInfo.boards}
                                    handleSelect={this.handleSelectChange}
                                    value={board}
                                />
                                <FormContent
                                    onChangeText={this.onChangeText}
                                    titleError={titleError}
                                    tagError={tagError}
                                    linkError={linkError}
                                    descriptionError={descriptionError}
                                    onSubmitPress={this.onSubmitPress}
                                    tag={tag}
                                    title={title}
                                    description={description}
                                    link={link}
                                />
                                {this.renderTags()}
                            </DialogContent>
                        </div>
                        <div className="splitContainer">
                            <DialogContent>
                                <div className="fileUpload" onClick={() => {}}>
                                    <FileUploader
                                        onUploadImages={this.onUploadImages}
                                        files={image}
                                    />
                                    {this.renderSmallText()}
                                </div>
                            </DialogContent>
                            <DialogContent />
                        </div>
                    </div>

                    <div className="dialogAction">
                        <DialogActions>
                            <Button onClick={this.onCreatePress} color="primary" className="create">
                                Create
                            </Button>
                        </DialogActions>
                    </div>
                    <SnackBar
                        message={imageError}
                        variant="error"
                        open={this.state.SnackBar}
                        onClose={() => this.setState({ SnackBar: false })}
                    />
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
    profileStore: state.ProfileStore
});

function mapDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            getBoardsandPosts,
            addPost,
            createPost
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostDialog);
