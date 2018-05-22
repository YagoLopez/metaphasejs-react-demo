import * as React from 'react';
import {removeSplashScreen} from "./utils";

export class ErrorBoundary extends React.Component {

  state: {hasError: boolean};

  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  error: string;

  componentDidCatch(error: any, info: any) {
    removeSplashScreen();
    this.setState({hasError: true});
    this.error = error.message[0].toUpperCase() + error.message.substring(1);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <fieldset>
            <legend>Error</legend>
            <div className="error">Error loading application</div>
            <br/>
            <div className="centered">{this.error}</div>
          </fieldset>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}