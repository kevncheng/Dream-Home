import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp, login } from '../actions/userActions';
import SignUpForm from '../components/Dialog/SignUp/SignUpForm';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import './stylesheet/SignUp.css';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
    container: {
        display: 'grid',
        justifyItems: 'center',
        zIndex: '0'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridGap: '15px',
        justifyItems: 'center'
    },
    card: {
        height: '55vh',
        width: '18vw',
        background: 'yellow'
    },
    signin: {
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
    modal: {
        backgroundColor: 'white',
        width: '35vw',
        height: '90vh',
        borderRadius: '15px',
        textAlign: 'center'
    },
    inputContainer: {
        height: '13vh',
        minWidth: '22vw',
        padding: '0',
        margin: '0'
    },
    input: {
        width: '22vw',
        marginTop: '10px',
        '& label': {
            fontWeight: 'bold',
            color: 'black'
        }
    },
    welcome: {
        marginBottom: '0'
    },
    signupbutton: {
        border: '1px solid lightgrey',
        backgroundColor: 'white',
        padding: '10px 50px 10px 50px',
        margin: '0 auto',
        marginTop: '5px',
        borderRadius: '50px',
        fontWeight: 'bold',
        display: 'block',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    footer: {
        borderTop: '1px solid lightgrey',
        paddingTop: '20px',
        marginTop: '35px',
        fontSize: '14px'
    },
    login: {
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'black',
        '&:hover': {
            color: 'blue',
            cursor: 'pointer'
        }
    },
    closeButton: {
        color: 'gray',
        marginTop: '10px',
        marginRight: '10px',
        float: 'right',
        '&:hover': {
            cursor: 'pointer',
            color: 'black'
        }
    }
});

// eslint-disable-next-line react/prop-types
const SignUp = ({ history, signUp, login, userStore: { loading, error } }) => {
    const style = useStyles();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password2: '',
        passwordError: '',
        usernameError: ''
    });
    const { email, username, password, password2, passwordError, usernameError } = formData;

    const onChangeText = e =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            [`${e.target.name}Error`]: ''
        });

    const postInfo = () => {
        if (password !== password2) {
            setFormData({ ...formData, passwordError: 'Passwords do not match' });
        }
        if (password.length < 8) {
            setFormData({
                ...formData,
                passwordError: 'Password must contain at least 8 characters'
            });
        }

        // TODO: Fix Signup (fix password validation as well)
        // if (!password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd$@!%*?&].{8,}/)) {

        if (username.length < 6 || username.length > 20) {
            setFormData({
                ...formData,
                usernameError: 'Username must be atleast 6 to 20 characters'
            });
        } else if (
            password === password2 &&
            password.length > 8 &&
            username.length > 6 &&
            username.length < 20
        ) {
            const body = {
                username,
                name: username,
                email,
                password
            };
            signUp(body);
        }
    };

    const onCloseClick = () => {
        history.push('/');
    };

    const renderLoading = () => {
        if (loading) {
            return <LinearProgress />;
        }
    };
    if (error.status === 'success') {
        login({ email, password });
        history.push('/');
    }

    return (
        <Dialog open={true} aria-labelledby="form-dialog-title" onClick={() => onCloseClick()}>
            {renderLoading()}
            <div onClick={e => e.stopPropagation()}>
                <CloseIcon
                    className={style.closeButton}
                    fontSize="small"
                    onClick={() => onCloseClick()}
                />

                <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Create an account!
                </DialogTitle>
                <SignUpForm
                    onChangeText={onChangeText}
                    username={username}
                    email={email}
                    password={password}
                    password2={password2}
                    passwordError={passwordError}
                    usernameError={usernameError}
                />
                <DialogActions>
                    <Button
                        onClick={postInfo}
                        color="primary"
                        className={style.signupbutton}
                        disabled={loading}
                    >
                        Sign Up!
                    </Button>
                </DialogActions>

                <p className={style.footer} style={{ textAlign: 'center' }}>
                    Already a Member?{' '}
                    <Link to="/login" className={style.login}>
                        Log In!
                    </Link>
                </p>
            </div>
        </Dialog>
    );
};

const mapStateToProps = state => ({
    userStore: state.UserStore
});

export default connect(
    mapStateToProps,
    { signUp, login }
)(SignUp);
