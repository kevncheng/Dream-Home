import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    headerSearch: {
        width: '35vw',
        minHeight: '40px',
        borderRadius: '50px',
        border: '1px solid lightgrey',
        paddingLeft: '15px',
        outline: 'none',
        '&::before': {
            display: 'none'
        },
        '&::after': {
            display: 'none'
        },
        '& > input': {
            textAlign: 'left',
            '&::placeholder': {
                color: 'black',
                opacity: 0.7
            }
        }
    },
    close: {
        marginRight: 8,
        cursor: 'pointer'
    },
    searchIcon: {
        cursor: 'pointer'
    },
    searchingIcon: {
        color: '#147EFB',
        cursor: 'pointer'
    }
}));

const NavSearch = ({ search, handleSearch, handleChange, clear, posts, history }) => {
    const classes = useStyles();

    function renderClearButton () {
        if (search && posts.loading) {
            return <CircularProgress size={12} />;
        } else if (search) {
            return <CloseIcon fontSize={'small'} onClick={clear} />;
        }
        return <div/>;
    }
    return (
        <form onSubmit={handleSearch} noValidate>
            <Input
                className={classes.headerSearch}
                placeholder='Search'
                value={search}
                onChange={handleChange}
                startAdornment={
                    <InputAdornment position='start'>
                        <SearchIcon
                            fontSize={'small'}
                            className={search ? classes.searchingIcon : classes.searchIcon}
                            onClick = {handleSearch}
                        />
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position='end' className={classes.close}>
                        {renderClearButton()}
                    </InputAdornment>
                }
            />
        </form>
    );
};

const mapStateToProps = state => ({
    posts: state.posts
});

export default compose(withRouter, connect(mapStateToProps))(NavSearch);
