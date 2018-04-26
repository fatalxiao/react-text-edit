import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import 'assets/sass/Catalog.scss';

class Catalog extends Component {

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
                    this.catalogs.map(item =>
                        <NavLink key={item.name}
                                 className="catalog-link"
                                 to={item.route}>
                            {item.name}
                        </NavLink>
                    )
                }

            </div>
        );
    }
}

export default Catalog;