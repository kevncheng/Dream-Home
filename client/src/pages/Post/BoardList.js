import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
    select: {
        borderRadius: 25,
        border: '1px #ddd solid',
        display: 'block',
        padding: '0.4rem',
        marginTop: '2rem'
    },
    board: {
        display: 'inline-block',
        minWidth: 'calc(100% - 100px)',
        margin: '0.3rem 0 0 1rem',
        '&:before': {
            display: 'none'
        },
        '&:after': {
            display: 'none'
        }
    },
    save: {
        display: 'inline-block',
        float: 'right',
        minWidth: 75
    }
}));

// eslint-disable-next-line react/prop-types
const BoardList = ({ boards, handleSelect, value, handleSave, visible }) => {
    const classes = useStyles();

    if (!visible) {
        return null;
    }

    return (
        <form autoComplete='off'>
            <FormControl className={classes.select} component={'div'}>
                <Select value={value} onChange={handleSelect}
                    displayEmpty variant={'outlined'} className={classes.board}
                    inputProps={{
                        name: 'board',
                        id: 'board'
                    }}
                >
                    <MenuItem value="" button={false} component={'li'}>Select board</MenuItem>
                    {boards.map((board, i) => {
                        return (
                            <MenuItem key={i} value={board._id} button={false} component={'li'}>
                                {board.title}
                            </MenuItem>
                        );
                    })}
                </Select>
                <span>
                    <Button variant="contained" size="medium" color="primary" className={classes.save} onClick={handleSave} href={''}>Save</Button>
                </span>
            </FormControl>
        </form>
    );
};

export default BoardList;
