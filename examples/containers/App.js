import React, {Component} from 'react';

import ReactEditor from 'src/ReactEditor';

import 'assets/font-awesome/css/font-awesome.min.css';
import 'sass/global.scss';
import 'sass/App.scss';

import MacDownHelpText from 'assets/files/MacDownHelp.txt';

export default class App extends Component {

    constructor(props) {

        super(props);

        this._nextStateAnimationFrameId = null;

        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            data: MacDownHelpText
        };

        this.resizeHandle = this::this.resizeHandle;

    }

    _setNextState(state) {
        if (this._nextStateAnimationFrameId) {
            cancelAnimationFrame(this._nextStateAnimationFrameId);
        }
        this._nextStateAnimationFrameId = requestAnimationFrame(() => {
            this._nextStateAnimationFrameId = null;
            this.setState(state);
        });
    }

    resizeHandle(e) {
        this._setNextState({
            windowWidth: e.target.innerWidth,
            windowHeight: e.target.innerHeight
        });
    }

    componentDidMount() {

        window.addEventListener('resize', this.resizeHandle);

        document.getElementById('loading').style.display = 'none';

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandle);
    }

    render() {

        const {windowWidth, windowHeight, data} = this.state;

        return (
            <div className="app">

                <ReactEditor data={data}
                             options={{
                                 width: windowWidth,
                                 height: windowHeight,
                                 gutterPosition: 'right'
                             }}/>

            </div>
        );

    }
}