import React from 'react';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DialogTitle, DialogContent } from '../components';
import SnackBar from '../../SnackBar/SnackBar';
import { login, signIn, clearError } from '../../../actions/userActions';
import { Link, Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';

const styles = theme => ({
    footer: {
        borderTop: '1px solid lightgrey',
        padding: theme.spacing(3),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    signUp: {
        textDecoration: 'none',
        color: 'black',
        fontWeight: 'bold',
        '&:hover': {
            color: 'blue',
            cursor: 'pointer'
        }
    },
    p: {
        fontSize: '14px',
        margin: 'auto'
    }
});

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
        snackBar: false
    };

    handleChange = e => {
        this.setState({
            ...this.state,
            [`${e.target.name}Error`]: '',
            [e.target.name]: e.target.value
        });
    };

    handleSignIn = e => {
        e.preventDefault();
        const { email, password } = this.state;
        const error = {};
        if (email.length < 1 || password.length < 1) {
            error.emailError = email.length < 1 ? 'Email cannot be empty' : '';
            error.passwordError = password.length < 1 ? 'Password cannot be empty' : '';
            const { emailError, passwordError } = error;
            this.setState({ ...this.state, emailError, passwordError });
        } else {
            this.props.signIn({
                email,
                password
            });
        }

        // const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    };

    onCloseClick = () => {
        this.props.history.push('/');
    };

    render () {
        const {
            classes,
            userStore: { authenticated, loading, error, user },
            clearError
        } = this.props;
        const { email, emailError, password, passwordError } = this.state;
        if (authenticated) {
            return <Redirect to={`/profile/${user.username}`} />;
        }
        return (
            <Dialog
                aria-labelledby="dialog-title"
                open
                maxWidth={'md'}
                onClick={() => this.onCloseClick()}
            >
                <div style={{ visibility: loading ? 'visible' : 'hidden' }}>
                    <LinearProgress />
                </div>
                <div onClick={e => e.stopPropagation()}>
                    <DialogTitle id="title" onClose={this.onCloseClick}>
                        Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <LoginForm
                            handleChange={this.handleChange}
                            handleSignIn={this.handleSignIn}
                            email={email}
                            emailError={emailError}
                            passwordError={passwordError}
                            password={password}
                            disabled={this.state.snackBar}
                            loading={loading}
                        />
                    </DialogContent>
                    <div className={classes.footer}>
                        <p className={classes.p}>
                            {'Don\'t have an account?'}
                            <Link to="/signup" className={classes.signUp}>
                                {' '}
                                Sign Up!
                            </Link>
                        </p>
                    </div>
                    <SnackBar
                        message={error.message}
                        variant={error.status}
                        open={Boolean(error.message)}
                        onClose={clearError}
                        duration={3000}
                    />
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore
});

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        {
            login,
            signIn,
            clearError
        }
    )
)(Login);
