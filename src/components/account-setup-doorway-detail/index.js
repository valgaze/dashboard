import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@density/ui-button';
import InputBox from '@density/ui-input-box';
import Card, { CardBody } from '@density/ui-card';
import Subnav, { SubnavItem } from '../subnav/index';

import AccountSetupHeader from '../account-setup-header/index';
import AccountSetupDoorwayDetailImageUpload from '../account-setup-doorway-detail-image-upload/index';

const CENTIMETERS_PER_INCH = 2.54;

const IMPERIAL = 'IMPERIAL',
  METRIC = 'METRIC';

const AC_OUTLET = 'AC_OUTLET',
      POWER_OVER_ETHERNET = 'POWER_OVER_ETHERNET';

export class AccountSetupDoorwayDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doorway: this.props.initialDoorway,

      insideImage: null,
      outsideImage: null,

      measurementUnit: METRIC,
      inputWidth: '12',
      inputHeight: '100',

      hasClearance: true,

      powerType: POWER_OVER_ETHERNET,
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

            <h2 className="account-setup-doorway-detail-body-header">
              <em>1 &mdash;</em>
              Upload images
            </h2>

            <span>Image taken from inside the space</span>
            <AccountSetupDoorwayDetailImageUpload
              value={this.state.insideImage}
              onChange={file => {
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    this.setState({insideImage: reader.result});
                  };
                } else {
                  this.setState({insideImage: null});
                }
              }}
            />

            <span>Image taken from outside the space</span>
            <AccountSetupDoorwayDetailImageUpload
              value={this.state.outsideImage}
              onChange={file => {
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    this.setState({outsideImage: reader.result});
                  };
                } else {
                  this.setState({outsideImage: null});
                }
              }}
            />

            <h2 className="account-setup-doorway-detail-body-header">
              <em>2 &mdash;</em>
              Name this doorway
            </h2>
            <label htmlFor="account-setup-doorway-detail-body-doorway-name">Doorway Name</label>
            <InputBox
              placeholder="Doorway Name"
              onChange={e => this.setState({doorway: {...this.state.doorway, name: e.target.value}})}
              value={this.state.doorway.name}
            />

            <h2 className="account-setup-doorway-detail-body-header">
              <em>3 &mdash;</em>
              Measure your doorway
            </h2>
            <input
              type="radio"
              checked={this.state.measurementUnit === METRIC}
              onChange={() => {
                this.setState({
                  measurementUnit: METRIC,
                  inputWidth: this.state.inputWidth * CENTIMETERS_PER_INCH,
                  inputHeight: this.state.inputHeight * CENTIMETERS_PER_INCH,
                });
              }}
            /> Metric
            <input
              type="radio"
              checked={this.state.measurementUnit === IMPERIAL}
              onChange={() => {
                this.setState({
                  measurementUnit: IMPERIAL,
                  inputWidth: parseInt(this.state.inputWidth, 10) / CENTIMETERS_PER_INCH,
                  inputHeight: parseInt(this.state.inputHeight, 10) / CENTIMETERS_PER_INCH,
                });
              }}
            /> Imperial
            <br/>

            <span>Doorway width</span>
            <InputBox
              placeholder={this.state.measurementUnit === METRIC ? 'cm' : 'inches'}
              value={this.state.inputWidth}
              onChange={e => this.setState({inputWidth: e.target.value})}
            />

            <span>Doorway height</span>
            <InputBox
              placeholder={this.state.measurementUnit === METRIC ? 'cm' : 'inches'}
              value={this.state.inputHeight}
              onChange={e => this.setState({inputHeight: e.target.value})}
            />

            <br/>
            <span>Does doorway have at least 5in (0.13m) of clearance above the door to mount a unit?</span>
            <br/>
            <input
              type="radio"
              checked={this.state.hasClearance}
              onChange={() => this.setState({hasClearance: true})}
            /> Yes
            <br/>
            <input
              type="radio"
              checked={!this.state.hasClearance}
              onChange={() => this.setState({hasClearance: false})}
            /> No

            <h2 className="account-setup-doorway-detail-body-header">
              <em>4 &mdash;</em>
              Choose power option
            </h2>

            <span>How will you provide power to the unit?</span>
            <br/>
            <input
              type="radio"
              checked={this.state.powerType === POWER_OVER_ETHERNET}
              onChange={() => this.setState({powerType: POWER_OVER_ETHERNET})}
            /> Power over Ethernet (PoE)
            <br/>
            <input
              type="radio"
              checked={this.state.powerType === AC_OUTLET}
              onChange={() => this.setState({powerType: AC_OUTLET})}
            /> Standard 120-240V outlet
            <br/>
            <br/>

            <Button>Save &amp; Close</Button>
            <br/>
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
