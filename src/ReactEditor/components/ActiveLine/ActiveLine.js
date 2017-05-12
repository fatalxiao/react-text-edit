import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './ActiveLine.scss';

export default class ActiveLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorOptions, contentWidth, selectStartPosition, selectStopPosition} = this.props;

        const activeLineStyle = {
            width: contentWidth + editorOptions.horizontalPadding * 2 + editorOptions.scrollBarWidth,
            height: editorOptions.lineHeight,
            top: selectStopPosition ? selectStopPosition.top : (selectStartPosition ? selectStartPosition.top : 0)
        };

        return (
            <div className="react-editor-active-line"
                 style={activeLineStyle}></div>
        );

    }
};

ActiveLine.propTypes = {
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object
};

ActiveLine.defaultProps = {
    editorOptions: null,
    contentWidth: 0,
    selectStartPosition: null,
    selectStopPosition: null
};