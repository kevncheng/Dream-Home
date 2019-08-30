import React from 'react';
import { TextField } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import '../../../pages/stylesheet/SignUp.css';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        background: 'black'
    },
    input: {
        color: 'white'
    },
    '&$label': {
        color: 'white',
        textAlign: 'center'
    }
};

const SignUpForm = ({
    name,
    username,
    email,
    password,
    password2,
    passwordError,
    usernameError,
    onChangeText
}) => {
    return (
        <>
            <DialogContent>
                <TextField
                    label="Username"
                    name="username"
                    value={username}
                    onChange={e => onChangeText(e)}
                    style={{ width: '400px', marginLeft: '40px', marginRight: '40px', marginBottom: '10px' }}
                    error={Boolean(usernameError)}
                    helperText={usernameError}
                    FormHelperTextProps={{ style: { float: 'left', position: 'absolute', bottom: -15 } }}
                />
            </DialogContent>
            <DialogContent style={{ marginBottom: '5px' }}>
                <TextField
                    label="E-mail"
                    name="email"
                    autoComplete = 'off'
                    value={email}
                    onChange={e => onChangeText(e)}
                    style={{ width: '400px', marginLeft: '40px', marginRight: '40px' }}
                />
            </DialogContent>
            <DialogContent style={{ marginBottom: '5px' }}>
                <TextField
                    label="Password"
                    name="password"
                    autoComplete = 'off'
                    type="password"
                    value={password}
                    onChange={e => onChangeText(e)}
                    style={{ width: '400px', marginLeft: '40px', marginRight: '40px', marginBottom: '10px' }}
                    error={Boolean(passwordError)}
                    helperText={passwordError}
                    FormHelperTextProps={{ style: { float: 'left', position: 'absolute', bottom: -15 } }}
                />
            </DialogContent>
            <DialogContent style={{ marginBottom: '5px' }}>
                <TextField
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    value={password2}
                    onChange={e => onChangeText(e)}
                    style={{ width: '400px', marginLeft: '40px', marginRight: '40px' }}
                />
            </DialogContent>
        </>
    );
};

export default withStyles(styles)(SignUpForm);
