// import React from 'react';
// import {Route, IndexRoute} from 'react-router';
//
// import Root from './containers/Root';
// import Catalog from './containers/Catalog';
//
// export default (
//     <Route path="/" component={Root}>
//
//         <IndexRoute component={Catalog}/>
//
//         <Route path="full-screen"
//                getComponent={(nextState, cb) => {
//                    require.ensure([], (require) => {
//                        cb(null, require('containers/FullScreenEditor').default);
//                    }, 'FullScreenEditor');
//                }}/>
//
//         <Route path="specified-size"
//                getComponent={(nextState, cb) => {
//                    require.ensure([], (require) => {
//                        cb(null, require('containers/SpecifiedSizeEditor').default);
//                    }, 'SpecifiedSizeEditor');
//                }}/>
//
//         <Route path="mark-down-editor"
//                getComponent={(nextState, cb) => {
//                    require.ensure([], (require) => {
//                        cb(null, require('containers/MarkDownEditor').default);
//                    }, 'MarkDownEditor');
//                }}/>
//
//     </Route>
// );

import ac from 'components/AsyncComponent';

export default [{
    component: ac(() => import('containers/Root')),
    routes: [{
        path: '/catalog',
        component: ac(() => import('containers/Catalog'))
    }, {
        path: '/full-screen',
        component: ac(() => import('containers/FullScreenEditor'))
    }, {
        path: '/specified-size',
        component: ac(() => import('containers/SpecifiedSizeEditor'))
    }, {
        path: '/mark-down-editor',
        component: ac(() => import('containers/MarkDownEditor'))
    }]
}];