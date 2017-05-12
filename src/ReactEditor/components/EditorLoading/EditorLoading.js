import React, {Component} from 'react';

import './EditorLoading.scss';

export default class EditorLoading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
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
        );
    }
};