import React from 'react';
import { withStyles } from '@material-ui/styles';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DialogTitle, DialogContent } from '../components';
import SnackBar from '../../SnackBar/SnackBar';
import { login, loginResponse } from '../../../actions/userActions';
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
    constructor (props) {
        super(props);

        this.emailValidator = this.emailValidator.bind(this);
        this.passwordValidator = this.passwordValidator.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.snackBarClose = this.snackBarClose.bind(this);

        this.state = {
            open: true,
            email: { value: '', error: false, message: '', validator: this.emailValidator },
            password: { value: '', error: false, message: '', validator: this.passwordValidator },
            snackBar: false
        };
    }

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;

        this.state[name].validator(value);
    };

    handleSignIn = e => {
        e.preventDefault();

        this.props.login({
            email: this.state.email.value,
            password: this.state.password.value
        });

        this.setState({ snackBar: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.history.push('/');
    };

    snackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ snackBar: false });
        this.props.dispatch(loginResponse());
    };

    ServerResponse = () => {
        const {
            userStore: { authenticated, error }
        } = this.props;
        if (authenticated) {
            return (
                <SnackBar
                    message={error.message}
                    variant={error.status}
                    open={this.state.snackBar}
                    onClose={this.snackBarClose}
                    duration={2000}
                />
            );
        } else if (!authenticated && error) {
            return (
                <SnackBar
                    message={error.message}
                    variant={error.status}
                    open={this.state.snackBar}
                    onClose={this.snackBarClose}
                    duration={3000}
                />
            );
        }

        return null;
    };

    Loading = () => {
        if (this.state.snackBar) {
            return <LinearProgress />;
        }

        return null;
    };

    emailValidator (value) {
        const email = this.state.email;
        // eslint-disable-next-line no-useless-escape
        const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (value === '') {
            email.error = true;
            email.message = 'Email must not be empty';
        } else if (!emailPattern.test(value)) {
            email.error = true;
            email.message = 'Email is not valid';
        } else {
            email.error = false;
            email.message = '';
        }
        email.value = value;

        this.setState({ email });
    }

    passwordValidator (value) {
        const password = this.state.password;

        if (value === '' || !value) {
            password.error = true;
            password.message = 'Password must not be empty';
        } else {
            password.error = false;
            password.message = '';
        }
        password.value = value;

        this.setState({ password });
    }

    render () {
        const { classes } = this.props;

        if (this.props.userStore.authenticated && !this.state.snackBar) {
            return <Redirect to={'/profile/' + this.props.userStore.user.username} />;
        }

        return (
            <div>
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="dialog-title"
                    open={this.state.open}
                    maxWidth={'md'}
                >
                    <this.Loading />
                    <DialogTitle id="title" title={'Welcome!'} onClose={this.handleClose} />
                    <DialogContent>
                        <LoginForm
                            handleChange={this.handleChange}
                            handleSignIn={this.handleSignIn}
                            email={this.state.email}
                            password={this.state.password}
                            disabled={this.state.snackBar}
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
                </Dialog>
                <this.ServerResponse />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore
});

function mapDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            login,
            dispatch
        },
        dispatch
    );
}

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Login);
