import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';

import router from './RouterReducer';

const rootReducer = combineReducers({
    routing,
    router
});

export default rootReducer;