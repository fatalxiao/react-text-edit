import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class TextMarker extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="react-editor-text-marker">

                <div className="react-editor-active-line"></div>

            </div>
        );
    }
};

TextMarker.propTypes = {
    cursorPosition: PropTypes.object
};

TextMarker.defaultProps = {
    cursorPosition: null
};