import { combineReducers } from 'redux';
import UserStore from './userReducer';
import PostStore from './post';
import ProfileStore from './profileReducer';
import BoardStore from './boardReducer';
import posts from './postFetch';
import CommentsStore from './commentsFetch';

const root = combineReducers({
    UserStore,
    PostStore,
    ProfileStore,
    posts,
    BoardStore,
    CommentsStore
});
export default root;
