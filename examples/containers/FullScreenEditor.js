import React, {Component} from 'react';

import ReactEditor from 'src/ReactEditor';

import MacDownHelpText from 'assets/files/MacDownHelp.txt';

export default class FullScreenEditor extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactEditor className="full-screen-editor"
                         data={MacDownHelpText}
                         options={{
                             isFullScreen: true
                         }}/>
        );
    }
}