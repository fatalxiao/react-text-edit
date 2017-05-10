import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLine from '../TextLine';

import './TextLayer.scss';

export default class TextLayer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, dataArray} = this.props;

        return (
            <div className={`react-editor-text-layer ${className}`}
                 style={style}>

                {
                    dataArray.map((line, index) => {
                        return (
                            <TextLine {...this.props}
                                      key={index}
                                      data={line}/>
                        );
                    })
                }

            </div>
        );

    }
};

TextLayer.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    dataArray: PropTypes.array,
    options: PropTypes.object

};

TextLayer.defaultProps = {

    className: '',
    style: null,

    dataArray: [],
    options: null

};