import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './TextLayer.scss';

export default class TextLayer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, data} = this.props;

        return (
            <div className={`react-editor-text-layer ${className}`}
                 style={style}>



            </div>
        );

    }
};

TextLayer.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    data: PropTypes.string

};

TextLayer.defaultProps = {

    className: '',
    style: null,

    data: ''

};