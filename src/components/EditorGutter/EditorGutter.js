import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './EditorGutter.scss';

export default class EditorGutter extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {gutterWidth} = this.props,
            style = {
                width: gutterWidth
            };

        return (
            <div className="react-editor-gutter"
                 style={style}>

            </div>
        );

    }
};

EditorGutter.propTypes = {
    gutterWidth: PropTypes.number
};

EditorGutter.defaultProps = {
    gutterWidth: 50
};