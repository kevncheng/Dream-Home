import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Login from '../components/Dialog/Login/Login';

const styles = theme => ({
    root: {
        textAlign: 'center',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
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
    }
});

class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        this.props.history.push('/login');
    }

    render () {
        const { classes } = this.props;

        // TODO: Fix/figure out how we want login to display
        return (
            <div className={classes.container}>
                <h1>Home</h1>
                <Route path='/login' component={Login}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userStore: state.UserStore
});

export default compose(withStyles(styles), connect(mapStateToProps))(Home);
