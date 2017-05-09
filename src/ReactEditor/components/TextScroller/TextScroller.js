import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLayer from '../TextLayer';

export default class TextScroller extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, data} = this.props;

        return (
            <div className={`react-editor-text-scroller ${className}`}
                 style={style}>

                <TextLayer data={data}/>

            </div>
        );

    }
};

TextScroller.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    data: PropTypes.string,

    onChange: PropTypes.func

};

TextScroller.defaultProps = {

    className: '',
    style: null,

    data: ''

};