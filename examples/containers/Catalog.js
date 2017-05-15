import React, {Component} from 'react';
import {Link} from 'react-router';

import 'assets/sass/Catalog.scss';

export default class Catalog extends Component {

    constructor(props) {

        super(props);

        this.catalogs = [{
            name: 'Full Screen',
            route: '/full-screen'
        }, {
            name: 'Specified Size',
            route: '/specified-size'
        }, {
            name: 'MarkDown Editor',
            route: '/mark-down-editor'
        }];

    }

    render() {
        return (
            <div className="catalog">

                <h1>Examples</h1>

                {
                    this.catalogs.map(item => {
                        return (
                            <Link key={item.name}
                                  className="catalog-link"
                                  to={item.route}>
                                {item.name}
                            </Link>
                        );
                    })
                }

            </div>
        );
    }
}