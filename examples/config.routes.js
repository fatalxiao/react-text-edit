import React from 'react';
import {Route} from 'react-router';

import App from './containers/Root';
import FullScreenEditor from './containers/FullScreenEditor';
import SpecifiedSizeEditor from './containers/SpecifiedSizeEditor';

export default (
    <Route path="/" component={App}>
        <Route path="fullscreen" component={FullScreenEditor}/>
        <Route path="specifiedsize" component={SpecifiedSizeEditor}/>
    </Route>
);