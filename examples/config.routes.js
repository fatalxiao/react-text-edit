import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Root from './containers/Root';
import FullScreenEditor from './containers/FullScreenEditor';
import SpecifiedSizeEditor from './containers/SpecifiedSizeEditor';

export default (
    <Route path="/" component={Root}>

        <IndexRoute component={FullScreenEditor}/>

        <Route path="fullscreen" component={FullScreenEditor}/>
        <Route path="specifiedsize" component={SpecifiedSizeEditor}/>

    </Route>
);