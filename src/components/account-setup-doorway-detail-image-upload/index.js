import React from 'react';

// All the possible states that this component can be rendered in.
export const UPLOADED = 'UPLOADED',
      NO_FILES = 'NO_FILES',
      MULTIPLE_FILES = 'MULTIPLE_FILES';

export default class AccountSetupDoorwayDetailImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      state: this.calculateStateGivenProps.call(this, props),
    };
  }

  // When the user updates the `value` prop, update the state to reflect it.
  // Yea, it's a bit of an anti pattern, but it's we want in this case.
  // More info: https://stackoverflow.com/questions/32414308/updating-state-on-props-change-in-react-form
  componentWillReceiveProps(nextProps) {
    const newComponentState = this.calculateStateGivenProps.call(this, nextProps);

    // Update if state changed.
    if (newComponentState !== this.state.state) {
      this.setState({state: newComponentState});
    }
  }
  calculateStateGivenProps(props) {
    if (props.value) {
      return UPLOADED;
    } else if (props.value === null) {
      return NO_FILES;
    } else {
      return this.state.state;
    }
  }

  fileUploaded(files) {
    if (files.length === 1) {
      // One file was uploaded.
      const file = files[0];

      this.setState({state: UPLOADED});
      return this.props.onChange(file);
    } else if (files.length === 0) {
      // No file was uploaded.
      this.setState({state: NO_FILES});
      return this.props.onChange(null);
    } else {
      // Multiple files were uploaded. This picker only supports one file.
      this.setState({state: MULTIPLE_FILES});
      return this.props.onMultipleFileUpload();
    }
  }

  render() {
    return <div className="account-setup-doorway-detail-image-upload-container">
      <div className="account-setup-doorway-detail-image-upload-header">
        <span className="account-setup-doorway-detail-image-upload-header-label">{this.props.label}</span>
        {this.state.state === UPLOADED ? <span
          className="account-setup-doorway-detail-image-upload-header-edit"
          onClick={() => this.fileinput.click()}
        >Edit</span> : null}
      </div>
      <div
        className="account-setup-doorway-detail-image-upload"
        onClick={() => this.fileinput.click()}
      >
        {/* This input[type=file] is hidden. It's "clicked" when its parent is clicked. */}
        <input
          type="file"
          className="account-setup-doorway-detail-form-element"
          ref={ref => { this.fileinput = ref; }}
          onChange={() => this.fileUploaded.call(this, this.fileinput.files)}
        />

        {/* Render empty state of image picker */}
        {
          this.state.state !== UPLOADED ?
          <span className="account-setup-doorway-detail-image-upload-icon empty">&#xe942;</span> :
          null
        }
        {
          this.state.state !== UPLOADED ?
          <span className="account-setup-doorway-detail-image-upload-link">Take a picture or upload file</span> :
          null
        }

        {/* Render full state of image picker */}
        {this.state.state === UPLOADED ? <img
          className="account-setup-doorway-detail-image-upload-preview"
          src={this.props.value}
          alt=""
        /> : null}
      </div>
    </div>;
  }
}
