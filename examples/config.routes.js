import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Root from './containers/Root';
import Catalog from './containers/Catalog';
import FullScreenEditor from './containers/FullScreenEditor';
import SpecifiedSizeEditor from './containers/SpecifiedSizeEditor';
import MarkDownEditor from './containers/MarkDownEditor';

export default (
    <Route path="/" component={Root}>

        <IndexRoute component={Catalog}/>

        <Route path="full-screen" component={FullScreenEditor}/>
        <Route path="specified-size" component={SpecifiedSizeEditor}/>
        <Route path="mark-down-editor" component={MarkDownEditor}/>

    </Route>
);