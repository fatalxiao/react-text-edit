import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ScrollBars extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style} = this.props;

        return (
            <div className={`react-editor-scroll-bars ${className}`}
                 style={style}>
            </div>
        );

    }
};

ScrollBars.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorOptions: PropTypes.object

};

ScrollBars.defaultProps = {

    className: '',
    style: null,

    editorOptions: null

};