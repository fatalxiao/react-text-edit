import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ActiveLine from '../ActiveLine';
import TextSelection from '../TextSelection';

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

                {
                    selectStartPosition && selectStopPosition ?
                        <TextSelection {...this.props}/>
                        :
                        null
                }

            </div>
        );
    }
};

TextMarker.propTypes = {
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object
};

TextMarker.defaultProps = {
    selectStartPosition: null,
    selectStopPosition: null
};