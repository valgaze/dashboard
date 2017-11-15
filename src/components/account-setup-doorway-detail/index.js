import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@density/ui-button';
import InputBox from '@density/ui-input-box';
import Card, { CardBody } from '@density/ui-card';
import Subnav, { SubnavItem } from '../subnav/index';

import AccountSetupHeader from '../account-setup-header/index';

const IMPERIAL = 'IMPERIAL'; //,
  //METRIC = 'METRIC';

const AC_OUTLET = 'AC_OUTLET'; //,
// POWER_OVER_ETHERNET = 'POWER_OVER_ETHERNET';

export class AccountSetupDoorwayDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doorway: this.props.initialDoorway,

      insideImage: null,
      outsideImage: null,

      measurementUnit: IMPERIAL,
      inputWidth: '',
      inputHeight: '',

      hasClearance: true,

      powerType: AC_OUTLET,
    };
  }
  render() {
    return <div className="account-setup-doorway-detail">
      <Subnav visible>
        <SubnavItem href="#/account/setup/overview">Overview</SubnavItem>
        <SubnavItem active href="#/account/setup/doorways">Doorways</SubnavItem>
      </Subnav>

      <AccountSetupHeader
        greeter="Doorways"
        detail="Provide more information about your doorways to guide installation."
      />

      <div className="account-setup-doorway-detail-body-container">
        <h1 className="account-setup-doorway-list-title">Create a doorway</h1>
        <h3 className="account-setup-doorway-list-subtitle">Tools needed: Tape measure</h3>

        <Card className="account-setup-doorway-detail-body">
          <CardBody>
            {JSON.stringify(this.state.doorway, null, 2)}

            <h2 className="account-setup-doorway-detail-body-header">1 &mdash; Upload images</h2>

            <input
              type="file"
              className="account-setup-doorway-detail-body-image-upload"
              ref={ref => { this.insideImageRef = ref; }}
              onChange={() => {
                if (this.insideImageRef.files.length === 1) {
                  const file = this.insideImageRef.files[0];

                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    this.setState({insideImage: reader.result});
                  };
                } else {
                  console.error('No file selected or more than one file selected!');
                }
              }}
            />
            {this.state.insideImage ? <img
              style={{width: 100}}
              src={this.state.insideImage}
              alt="Inside of Doorway"
            /> : null}

            <input
              type="file"
              className="account-setup-doorway-detail-body-image-upload"
              ref={ref => { this.outsideImageRef = ref; }}
              onChange={() => {
                if (this.outsideImageRef.files.length === 1) {
                  const file = this.outsideImageRef.files[0];

                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    this.setState({outsideImage: reader.result});
                  };
                } else {
                  console.error('No file selected or more than one file selected!');
                }
              }}
            />
            {this.state.outsideImage ? <img
              style={{width: 100}}
              src={this.state.outsideImage}
              alt="Outside of Doorway"
            /> : null}

            <h2 className="account-setup-doorway-detail-body-header">2 &mdash; Name this doorway</h2>
            <label htmlFor="account-setup-forway-detail-body-doorway-name">Doorway Name</label>
            <InputBox
              placeholder="Doorway Name"
              onChange={e => this.setState({doorway: {...this.state.doorway, name: e.target.value}})}
              value={this.state.doorway.name}
            />

            <h2 className="account-setup-doorway-detail-body-header">3 &mdash; Measure your doorway</h2>
            <span>Not done yet!</span>

            <h2 className="account-setup-doorway-detail-body-header">4 &mdash; Choose power option</h2>
            <Button>Save &amp; Close</Button>
            <Button>Save &amp; Add Another Doorway</Button>
          </CardBody>
        </Card>
      </div>
    </div>;
  }
}

export default connect(state => {
  return {
    initialDoorway: state.doorways.selected === 'new' ? {} :
      state.doorways.data.find(doorway => doorway.id === state.doorways.selected),
    doorwayCollectionLoading: state.doorways.loading,
  };
}, dispatch => {
  return {};
})(function AccountSetupDoorwayDetailWrapper(props) {
  if (typeof props.initialDoorway !== 'undefined') {
    return <AccountSetupDoorwayDetail {...props} />;
  } else {
    return <div>Loading...</div>;
  }
});
