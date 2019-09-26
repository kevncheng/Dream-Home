import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp, login, clearError } from '../actions/userActions';
import SignUpForm from '../components/Dialog/SignUp/SignUpForm';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import './stylesheet/SignUp.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import SnackBar from '../components/SnackBar/SnackBar';
import { DialogTitle } from '../components/Dialog/components';

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
        padding: '18px',
        fontSize: '14px',
        height: '100%'
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
    },
    loader: {
        position: 'relative',
        top: '0px',
        bottom: '0px'
    }
});

// eslint-disable-next-line react/prop-types
const SignUp = ({ history, signUp, login, clearError, userStore: { loading, error, authenticated, user } }) => {
    const style = useStyles();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password2: '',
        passwordError: '',
        usernameError: '',
        emailError: ''
    });
    const {
        email,
        username,
        password,
        password2,
        passwordError,
        usernameError,
        emailError
    } = formData;

    const onChangeText = e =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            [`${e.target.name}Error`]: ''
        });

    const postInfo = () => {
        const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const usernamePattern = /^[a-zA-Z0-9_.-]*$/;
        const update = {};
        if (
            password.length < 8 ||
            username.length < 6 ||
            username.length > 20 ||
            !emailPattern.test(email) ||
            !usernamePattern.test(username)
        ) {
            if (password.length < 8) {
                update.passwordError = 'Password must contain at least 8 characters';
            }
            if (password !== password2) {
                update.passwordError = 'Passwords do not match';
            }
            if (!usernamePattern.test(username)) {
                update.usernameError = 'Username must contain letters and numbers only';
            } else if (username.length < 6 || username.length > 20) {
                update.usernameError = 'Username must be atleast 6 to 20 characters';
            }
            if (!emailPattern.test(email)) {
                update.emailError = 'Email is not valid';
            }
            setFormData({
                ...formData,
                passwordError: update.passwordError,
                usernameError: update.usernameError,
                emailError: update.emailError
            });
        } else {
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

    if (authenticated) {
        return <Redirect to={`/profile/${user.username}`} />;
    }
    return (
        <Dialog open aria-labelledby="form-dialog-title" onClick={() => onCloseClick()}>
            <div style={{ visibility: loading ? 'visible' : 'hidden' }}>
                <LinearProgress />
            </div>
            <div onClick={e => e.stopPropagation()} style={{ overflow: 'hidden' }}>
                {/* <CloseIcon
                    className={style.closeButton}
                    fontSize="small"
                    onClick={() => onCloseClick()}
                /> */}

                <DialogTitle
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                    onClose={onCloseClick}
                >
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
                    emailError={emailError}
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
            <SnackBar
                message={error.message}
                variant={'error'}
                open={Boolean(error.message)}
                onClose={clearError}
                duration={3000}
            />
        </Dialog>
    );
};

const mapStateToProps = state => ({
    userStore: state.UserStore
});

export default connect(
    mapStateToProps,
    { signUp, login, clearError }
)(SignUp);
