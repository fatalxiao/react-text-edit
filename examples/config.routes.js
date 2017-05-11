import React from 'react';
import {Route} from 'react-router';

import Root from './containers/Root';
import FullScreenEditor from './containers/FullScreenEditor';
import SpecifiedSizeEditor from './containers/SpecifiedSizeEditor';

export default (
    <Route path="/" component={Root}>
        <Route path="fullscreen" component={FullScreenEditor}/>
        <Route path="specifiedsize" component={SpecifiedSizeEditor}/>
    </Route>
);