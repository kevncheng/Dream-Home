import React from 'react';
import { makeStyles } from '@material-ui/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import backyard from '../../../assets/interests/back.jpg';
import decor from '../../../assets/interests/decor.jpg';
import exterior from '../../../assets/interests/exterior.jpg';
import frontyard from '../../../assets/interests/front.jpg';
import garden from '../../../assets/interests/garden.jpg';
import interior from '../../../assets/interests/interior.jpg';
import location from '../../../assets/interests/location.jpg';
import modern from '../../../assets/interests/modern.jpg';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
    },
    image: {
        borderRadius: 10
    },
    title: {
        padding: '1rem 0 1rem 0',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#fafafa',
        position: 'absolute',
        bottom: -10,
        left: 0,
        width: '100%',
        textAlign: 'center'
    },
    check: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    selected: {
        width: 14,
        height: 14,
        margin: '0 auto',
        padding: '0 6px'
    },
    label: {
        width: 0, padding: 0
    }
}));

const interests = [
    { image: modern, title: 'House Style' },
    { image: location, title: 'Location' },
    { image: interior, title: 'Interior Design' },
    { image: exterior, title: 'Exterior design' },
    { image: frontyard, title: 'Front yard' },
    { image: backyard, title: 'Back Yard' },
    { image: decor, title: 'House decor' },
    { image: garden, title: 'Garden' }
];

const Interests = ({ handleChange, selected }) => {
    const classes = useStyles();

    const Check = ({ selected, interest, classes }) => {
        if (selected.includes(interest.title)) {
            return (
                <Chip
                    classes={{
                        root: classes.check,
                        colorPrimary: '#f5f5f5',
                        label: classes.label,
                        labelSmall: classes.label
                    }}
                    icon={<DoneIcon classes={{ root: classes.selected }}/>} size="small"
                />
            );
        }
        return null;
    };

    return (
        <div className={classes.root}>
            <GridList cols={4} spacing={20}>
                {interests.map((interest, i) => (
                    <GridListTile key={i} classes={{ tile: classes.image }} onClick={() => handleChange(interest.title)} >
                        <img src={interest.image} alt={interest.title} className={classes.image} />
                        <p className={classes.title}>{interest.title}</p>
                        <Check selected={selected} interest={interest} classes={classes}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
};

export default Interests;
