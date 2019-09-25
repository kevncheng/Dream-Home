import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { makeStyles } from '@material-ui/styles';
import { Link, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { logout } from '../../actions/userActions';
import NavMenu from './NavMenu';
import NavSearch from './NavSearch';
import { searchPosts } from '../../actions/post';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    header: {
        display: 'grid',
        gridTemplateColumns: '5fr 3fr 6fr 3fr 3fr 0fr 3fr',
        minHeight: '16vh',
        justifyItems: 'center',
        alignItems: 'center'
    },
    headerBottomBorder: {
        minHeight: '5px',
        backgroundImage: 'linear-gradient(lightgrey, white)'
    },
    headerContainer: {
        position: 'fixed',
        background: 'white',
        zIndex: '10'
    },
    placeholderHeader: {
        minHeight: '16vh',
        height: '16vh'
    },
    clear: {
        cursor: 'pointer'
    }
}));

const Navbar = ({ userStore: { authenticated, user }, logout, history, location, searchPosts }) => {
    const [search, setSearch] = React.useState('');
    const classes = useStyles();

    function handleLogOutClicked () {
        logout();
        history.push('/');
        window.location.reload();
    }

    function handleSearch (event) {
        event.preventDefault();
        // eslint-disable-next-line camelcase
        const { easy_filters = '' } = queryString.parse(location.search);
        if (authenticated) {
            searchPosts(search, easy_filters, user._id);
        } else {
            searchPosts(search, easy_filters, '');
        }
        history.push('/');
    }

    function handleSearchChange (event) {
        setSearch(event.target.value);
    }

    function clearSearch () {
        setSearch('');
    }

    return (
        <div>
            <div className={classes.headerContainer}>
                <div className={classes.header}>
                    <div>
                        <h3>Dream Home</h3>
                    </div>
                    <div />
                    <NavSearch
                        search={search}
                        handleSearch={handleSearch}
                        handleChange={handleSearchChange}
                        clear={clearSearch}
                    />
                    <div>
                        <h5>
                            <Link
                                to="/"
                                style={{
                                    textDecoration: 'none'
                                }}
                            >
                                <Button
                                    style={{
                                        border: 'none',
                                        padding: '0',
                                        borderRadius: '7.5px'
                                    }}
                                >
                                    Home
                                </Button>
                            </Link>
                        </h5>
                    </div>
                    <div>
                        <Link
                            to={authenticated ? `/profile/${user.username}` : '/login'}
                            style={{
                                textDecoration: 'none'
                            }}
                        >
                            <Button
                                style={{
                                    border: 'none',
                                    padding: '0',
                                    borderRadius: '7.5px'
                                }}
                            >
                                Profile
                            </Button>
                        </Link>
                    </div>
                    <div />
                    <NavMenu
                        user={user}
                        handleLogOutClicked={handleLogOutClicked}
                        authenticated={authenticated}
                    />
                </div>
                <div className={classes.headerBottomBorder} />
            </div>
            <div className={classes.placeholderHeader}>placeholder</div>
        </div>
    );
};

const mapStateToProps = state => ({
    userStore: state.UserStore
});

function mapDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            logout,
            searchPosts
        },
        dispatch
    );
}

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Navbar);
