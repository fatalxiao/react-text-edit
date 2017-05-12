import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ActiveLine from '../ActiveLine';

import './TextMarker.scss';

export default class TextMarker extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {selectStartPosition, selectStopPosition} = this.props;

        return (
            <div className="react-editor-text-marker">

                <ActiveLine {...this.props}/>

            </div>
        );
    }
};

TextMarker.propTypes = {
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object
};

TextMarker.defaultProps = {
    editorOptions: null,
    contentWidth: 0,
    selectStartPosition: null,
    selectStopPosition: null
};