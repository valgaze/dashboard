import * as React from 'react';


// Display modes
const FALLBACK = 'FALLBACK';
const LOADING = 'LOADING';
const DONE = 'DONE';


export default class ImageRetry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: DONE,
      retries: props.retries || 1
    };
  }

  retry() {
    this.setState({ 
      retries: this.state.retries - 1,
      mode: DONE
    });
  }

  scheduleRetry() {
    if (this.state.retries > 0) {
      this.setState({ mode: LOADING });
      window.setTimeout(this.retry.bind(this), this.props.interval);
    } else {
      this.setState({ mode: FALLBACK });
    }
  }

  render() {
    if (this.props.src && this.state.retries > 0 && this.state.mode === DONE) {
      console.log('Done: ', this.props.src);
      return <img
        src={this.props.src}
        alt={this.props.alt}
        className={this.props.className}
        style={this.props.style}
        onError={this.scheduleRetry.bind(this)}
      />;
    } else if (this.state.mode === LOADING) {
      console.log('Loading: ', this.props.src);
      return this.props.loadingContent || <div className="image-retry-loading"></div>;
    } else {
      console.log('Fallback: ', this.props.src);
      return this.props.fallbackContent || <div className="image-retry-fallback"></div>;
    }
  }
}
