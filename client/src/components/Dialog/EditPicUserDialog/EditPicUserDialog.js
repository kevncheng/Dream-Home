import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogTitle } from '../components';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import { editProfile } from '../../../actions/profileActions';
import '../../../pages/stylesheet/Dialog.css';
import { withRouter } from 'react-router-dom';

class EditPicUserDialog extends Component {
    state = {
        smallText: '',
        nameError: false,
        name: ''
    };

    componentDidMount = () => {
        const {
            userStore: { user }
        } = this.props;
        this.setState({
            profile: user.profile,
            name: user.name,
            username: user.username
        });
    };

    renderLoading = () => {
        if (this.props.profileStore.loading) {
            return <CircularProgress className="spinner" />;
        }
    };

    onChangeText = e => {
        this.setState({
            name: e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
        });
    };

    handleFileUpload = () => {
        document.getElementById('selectImage').click();
    };

    onChangeImage = e => {
        if (e.target.files[0]) {
            this.setState({
                profile: URL.createObjectURL(e.target.files[0]),
                imageFile: e.target.files[0]
            });
        }
    };

    onCloseClicked = () => {
        this.props.history.push(`/profile/${this.state.username}`);
    };

    onSavePress = () => {
        const { name, imageFile, username } = this.state;
        const { editProfile, history, profileStore } = this.props;
        if (name.length < 3 || name.length > 25) {
            this.setState({
                smallText: 'Name must at least 3 to 25 characters long',
                nameError: true
            });
        } else {
            const formData = new FormData();
            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (profileStore.profileInfo.name !== name) {
                formData.append('name', name);
            }
            editProfile(formData, username);
            history.push(`/profile/${username}`);
        }
    };

    render () {
        this.renderLoading();
        const { name, nameError, smallText } = this.state;
        return (
            <Dialog
                open={true}
                maxWidth="xs"
                fullWidth
                aria-labelledby="form-dialog-title"
                onClick={() => this.onCloseClicked()}
            >
                <div onClick={e => e.stopPropagation()}>
                    <DialogTitle
                        style={{ textAlign: 'center' }}
                        id="form-dialog-title"
                        onClose={this.onCloseClicked}
                    >
                        Edit avatar/username
                    </DialogTitle>
                    <DialogContent className="DialogContent">
                        <Avatar
                            style={{ height: 100, width: 100, margin: 10 }}
                            className="img"
                            src={this.state.profile || require('../../../assets/icon_profile.svg')}
                            onClick={() => this.handleFileUpload()}
                        />
                        <input
                            id="selectImage"
                            hidden
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={e => this.onChangeImage(e)}
                        />
                        <TextField
                            autoFocus
                            autoComplete="off"
                            margin="dense"
                            id="name"
                            type="name"
                            label="Name"
                            fullWidth
                            onChange={e => this.onChangeText(e)}
                            value={name}
                            helperText={smallText}
                            error={nameError}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onSavePress} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
    profileStore: state.ProfileStore
});

export default withRouter(
    connect(
        mapStateToProps,
        { editProfile }
    )(EditPicUserDialog)
);
