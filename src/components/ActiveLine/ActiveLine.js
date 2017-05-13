import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './ActiveLine.scss';

export default class ActiveLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorOptions, contentWidth, selectStopPosition} = this.props;

        const activeLineStyle = {
            width: contentWidth + editorOptions.horizontalPadding * 2 + editorOptions.scrollBarWidth,
            height: editorOptions.lineHeight,
            top: selectStopPosition.top
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
    selectStopPosition: PropTypes.object
};

ActiveLine.defaultProps = {
    editorOptions: null,
    contentWidth: 0,
    selectStopPosition: null
};