import { withStyles } from '@material-ui/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions/DialogActions';
import React from 'react';

const styles = theme => ({
    root: {
        textAlign: 'center',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    title: {
        fontWeight: 'bold',
        fontSize: 26
    }
});

const DialogTitle = withStyles(styles)(({ title, classes, onClose }) => {
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h5" className={classes.title}>{title}</Typography>
            <IconButton aria-label="close" className={classes.close} onClick={onClose} href={''}>
                <CloseIcon />
            </IconButton>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
        marginBottom: '2rem'
    }
}))(MuiDialogActions);

export { DialogTitle, DialogContent, DialogActions };
