import * as React from 'react';
import classnames from 'classnames';

export function InputStackGroup(props) {
  return <div
    {...props}
    className={classnames("input-stack-group-container", props.className)}
  >
    {props.children}
  </div>;
}

export class InputStackItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      focused: false
    };
  }

  render() {

    // Append correct container classes
    const containerClassName = classnames({
      'input-stack-item-container': true,
      'input-stack-item-pending-error': this.state.focused && this.props.invalid,
      'input-stack-item-pending-valid': this.state.focused && !this.props.invalid,
      'input-stack-item-error': !this.state.focused && this.props.invalid,
      'input-stack-item-valid': !this.state.focused && !this.props.invalid && this.props.value
    }, this.props.className);

    // Sanitize props to pass through to input
    const inputProps = Object.assign({}, this.props);
    delete inputProps.invalid;
    delete inputProps.focused;
    delete inputProps.className;

    // Intercept focus and blur events
    inputProps.onFocus = event => {
      this.setState({ focused: true });
      this.props.onFocus && this.props.onFocus(event);
    }
    inputProps.onBlur = event => {
      this.setState({ focused: false });
      this.props.onBlur && this.props.onBlur(event);
    }

    // Render container and input
    return <div className={containerClassName}>
      <input className="input-stack-item-input" {...inputProps} />
    </div>;
  }
}
