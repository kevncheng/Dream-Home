import React from 'react';
import { makeStyles } from '@material-ui/styles';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(6),
        backgroundColor: theme.palette.background.paper
    },
    signIn: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: '1',
        position: 'fixed',
        left: '0px',
        top: '0px',
        height: '100vh',
        width: '100vw',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        marginTop: '10px',
        textDecoration: 'underline',
        fontSize: '13px',
        color: 'grey',
        '&:hover': {
            color: 'blue',
            cursor: 'pointer'
        }
    },
    formControl: {
        marginBottom: theme.spacing(6),
        minWidth: '22vw'
    },
    textField: {
        width: '25vw'
    },
    button: {
        display: 'block',
        margin: '0 auto 0'
    }
}));

// eslint-disable-next-line react/prop-types
const LoginForm = ({
    handleChange,
    handleSignIn,
    email,
    password,
    emailError,
    passwordError,
    loading
}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <DialogContent style={{ width: '300px' }}>
                <TextField
                    type="email"
                    id="email"
                    name="email"
                    label="E-mail"
                    value={email.value}
                    onChange={e => handleChange(e)}
                    helperText={emailError}
                    FormHelperTextProps={{
                        style: { float: 'left', position: 'absolute', bottom: -15, color: 'red' }
                    }}
                    style={{
                        width: '100%',
                        marginLeft: '5px',
                        marginRight: '5px',
                        marginBottom: '10px'
                    }}
                    required
                />
            </DialogContent>
            <DialogContent style={{ width: '300px' }}>
                <TextField
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    value={password.value}
                    onChange={e => handleChange(e)}
                    helperText={passwordError}
                    FormHelperTextProps={{
                        style: { float: 'left', position: 'absolute', bottom: -15, color: 'red' }
                    }}
                    style={{
                        width: '100%',
                        marginLeft: '5px',
                        marginRight: '5px',
                        marginBottom: '10px'
                    }}
                    required
                />
                <p className={classes.forgotPassword}>Forgot your password?</p>
            </DialogContent>
            <div>
                <Button
                    onClick={handleSignIn}
                    color="primary"
                    className={classes.button}
                    href={''}
                    disabled={loading}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default LoginForm;
