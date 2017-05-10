import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DomLib from '../../utils/DomLib';

import './ScrollBars.scss';

export default class ScrollBars extends Component {

    constructor(props) {

        super(props);

        this.scrollTop2OffestTop = this::this.scrollTop2OffestTop;

    }

    scrollTop2OffestTop() {

    }

    componentDidMount() {

    }

    render() {

        const {className, style} = this.props;

        return (
            <div ref="scrollBars"
                 className={`react-editor-scroll-bars ${className}`}
                 style={style}>
            </div>
        );

    }
};

ScrollBars.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number

};

ScrollBars.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorOptions: null,
    scrollTop: 0,
    scrollLeft: 0

};