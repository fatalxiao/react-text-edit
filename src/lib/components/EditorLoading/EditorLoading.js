import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

import './EditorLoading.css';

export default class EditorLoading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CSSTransition classNames="react-editor-loading"
                           timeout={{enter: 0, exit: 250}}>
                {
                    this.props.editorInital ?
                        null
                        :
                        <div className="hljs react-editor-loading-wrapper">
                            <div className="react-editor-loading">
                                <div className="spinner">
                                    <div className="circle left">
                                        <div></div>
                                    </div>
                                    <div className="gap">
                                        <div></div>
                                    </div>
                                    <div className="circle right">
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </CSSTransition>
        );
    }
};

EditorLoading.propTypes = {
    editorInital: PropTypes.bool
};

EditorLoading.defaultProps = {
    editorInital: false
};