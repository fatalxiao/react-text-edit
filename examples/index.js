'use strict';

import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {renderRoutes} from 'react-router-config';

import routes from './config.routes';

render(
    renderRoutes(routes),
    document.getElementById('app-container')
);