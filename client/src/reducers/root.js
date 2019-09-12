import { combineReducers } from 'redux';
import UserStore from './userReducer';
import PostStore from './post';
import ProfileStore from './profileReducer';
import posts from './postFetch';
import BoardStore from './boardReducer';

const root = combineReducers({
    UserStore,
    PostStore,
    ProfileStore,
    posts,
    BoardStore
});
export default root;
