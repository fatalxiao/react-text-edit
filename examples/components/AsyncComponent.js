import React, {Component} from 'react';

function asyncComponent(getComponent) {

    return class AsyncComponent extends Component {

        constructor(props) {

            super(props);

            this.state = {
                Component: null
            };

        }

        componentWillMount() {
            if (!this.state.Component) {
                getComponent().then(({default: Component}) => {
                    this.setState({
                        Component
                    });
                });
            }
        }

        render() {

            const {Component} = this.state;

            if (Component) {
                return <Component {...this.props}/>;
            }

            return null;

        }

    };

}

export default asyncComponent;