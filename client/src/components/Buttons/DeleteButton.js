import React from 'react';
import { connect } from 'react-redux';
import { deleteItem } from '../../actions/profileActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import _ from 'lodash';

class DeleteButton extends React.Component {
    state = {
        open: false
    };

    handleOnDeletePress = () => {
        const { item, id, deleteItem } = this.props;
        deleteItem(item, id);
        this.setState({ open: false });
    };

    render () {
        const {
            profileStore: { profileInfo },
            userStore: { user, authenticated },
            title,
            item,
            className
        } = this.props;
        if (!authenticated) {
            return <div />;
        } else if (!_.isUndefined(profileInfo)) {
            if (user._id !== profileInfo._id) {
                return <div />;
            }
        }
        return (
            <>
                <IconButton
                    size="medium"
                    style={{
                        marginRight: '10px'
                    }}
                    onClick={() => this.setState({ open: true })}
                    className={className}
                >
                    <DeleteIcon style={{ color: item === 'posts' ? 'white' : 'gray' }} />
                </IconButton>
                <Dialog open={this.state.open} aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">{`Delete ${title}`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`Are you sure you want to delete this ${item}?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            Disagree
                        </Button>
                        <Button
                            onClick={() => this.handleOnDeletePress()}
                            color="primary"
                            autoFocus
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore,
    profileStore: state.ProfileStore
});

export default connect(
    mapStateToProps,
    { deleteItem }
)(DeleteButton);
