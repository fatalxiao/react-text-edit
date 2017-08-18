import React, {Component} from 'react';

import ReactTextEdit from 'dist';

import README from 'README.md';

export default class FullScreenEditor extends Component {

    constructor(props) {

        super(props);

        this.state = {
            data: README
        };

        this.changeHandle = this::this.changeHandle;

    }

    changeHandle(data) {
        this.setState({
            data
        });
    }

    render() {
        return (
            <ReactTextEdit className="full-screen-editor"
                           data={this.state.data}
                           isFullScreen={true}
                           // theme={ReactTextEdit.Theme.DARCULA}
                           options={{
                               showLineNumber: true
                           }}
                           onChange={this.changeHandle}/>
        );
    }
}