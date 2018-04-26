import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';

import 'assets/font-awesome/css/font-awesome.min.css';
import 'sass/global.scss';
import 'sass/Root.scss';
import 'sass/example.scss';

class Root extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.getElementById('loading').style.display = 'none';
    }

    render() {

        const {route, location} = this.props;

        return (
            <div className="root">

                {renderRoutes(route.routes)}

                {
                    location.pathname === '/' ?
                        <Redirect from="/" to="/catalog"/>
                        :
                        null
                }

            </div>
        );
    }
}

export default Root;