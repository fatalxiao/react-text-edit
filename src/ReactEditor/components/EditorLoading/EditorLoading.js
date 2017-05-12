import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import './EditorLoading.scss';

export default class EditorLoading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CSSTransitionGroup transitionName="react-editor-loading"
                                transitionEnterTimeout={0}
                                transitionLeaveTimeout={250}>
                {
                    this.props.editorInital ?
                        null
                        :
                        <div className="react-editor-loading-wrapper">
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
            </CSSTransitionGroup>
        );
    }
};

EditorLoading.propTypes = {
    editorInital: PropTypes.bool
};

EditorLoading.defaultProps = {
    editorInital: false
};