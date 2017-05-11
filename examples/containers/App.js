import React, {Component} from 'react';

import 'assets/font-awesome/css/font-awesome.min.css';
import 'sass/global.scss';
import 'sass/App.scss';
import 'sass/example.scss';

export default class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.getElementById('loading').style.display = 'none';
    }

    render() {
        return (
            <div className="app">
                {this.props.children}
            </div>
        );
    }
}