import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@density/ui-button';
import InputBox from '@density/ui-input-box';
import Card, { CardBody } from '@density/ui-card';
import RadioButton from '@density/ui-radio-button';
import Subnav, { SubnavItem } from '../subnav/index';

import AccountSetupHeader from '../account-setup-header/index';
import AccountSetupDoorwayDetailImageUpload from '../account-setup-doorway-detail-image-upload/index';

import collectionDoorwaysUpdate from '../../actions/collection/doorways/update';
import collectionDoorwaysCreate from '../../actions/collection/doorways/create';

import showModal from '../../actions/modal/show';

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

      measurementUnit: METRIC,

      // These are string representations of the width and height. Before they leave the component,
      // these values are added back into `state.doorway.{width,height}`.
      inputWidth: '',
      inputHeight: '',
    };
  }

  // Return the doorway in the representation returned by the core api. This method merges in fields
  // that were stored seperately (probably because they had to be stored in a different
  // representation due to data binding reasons.)
  formattedDoorway = () => {
    return {
      ...this.state.doorway,
      environment: {
        ...this.state.doorway.environment,
        width: window.parseFloat(this.state.inputWidth, 10),
        height: window.parseFloat(this.state.inputHeight, 10),
      },
    };
  }

  render() {
    // A doorway is being created if the doorway passed in is truthy and has an id key within it.
    // Otherwise, the doorway is being modified.
    const isCreatingNewDoorway = !this.state.doorway || !this.state.doorway.id;

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
        <h1 className="account-setup-doorway-list-title">
          {isCreatingNewDoorway ? "Create a doorway" : this.state.doorway.name}
        </h1>
        <h3 className="account-setup-doorway-list-subtitle">Tools needed: Tape measure</h3>

        <Card className="account-setup-doorway-detail-body">
          <CardBody>
            <h2 className="account-setup-doorway-detail-body-header">
              <em>1 &mdash;</em>
              Upload images
            </h2>

            <p className="account-setup-doorway-detail-body-section">
              When taking photos, please follow these guidelines:
            </p>

            <div className="account-setup-doorway-detail-body-guidelines-box">
              Stand at least 10ft away from the center of the doorway to capture the following:
              <ul>
                <li>Full, unobstructed view of the door</li>
                <li>Mounting space above the door</li>
                <li>Surrounding walls</li>
                <li>If there is a door, please prop open when capturing the image if possible</li>
              </ul>
            </div>

            <p className="account-setup-doorway-detail-body-section">
              Here's an example of an ideal image:
            </p>

            <img
              className="account-setup-doorway-detail-body-ideal-image-box"
              src="https://densityco.github.io/assets/images/r57-doorway-blue-edit2.c7f85388.png"
              alt="Ideal doorway"
            />

            <AccountSetupDoorwayDetailImageUpload
              label="Image taken from inside the space"
              value={this.state.doorway.environment.insideImageUrl}
              onChange={file => {
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    // Update the doorway.environment.insideImageUrl
                    this.setState({
                      doorway: {
                        ...this.state.doorway,
                        environment: {
                          ...this.state.doorway.environment,
                          insideImageUrl: reader.result,
                        },
                      },
                    });
                  };
                } else {
                  // Clear out the image url inside of the envirnment if the user didn't select a
                  // user.
                  this.setState({
                    doorway: {
                      ...this.state.doorway,
                      environment: {...this.state.doorway.environment, insideImageUrl: null},
                    },
                  });
                }
              }}
            />

            <AccountSetupDoorwayDetailImageUpload
              label="Image taken from outside the space"
              value={this.state.doorway.environment.outsideImageUrl}
              onChange={file => {
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    // Update the doorway.environment.outsideImageUrl
                    this.setState({
                      doorway: {
                        ...this.state.doorway,
                        environment: {
                          ...this.state.doorway.environment,
                          outsideImageUrl: reader.result,
                        },
                      },
                    });
                  };
                } else {
                  // Clear out the image url outside of the envirnment if the user didn't select a
                  // user.
                  this.setState({
                    doorway: {
                      ...this.state.doorway,
                      environment: {...this.state.doorway.environment, outsideImageUrl: null},
                    },
                  });
                }
              }}
            />


            <h2 className="account-setup-doorway-detail-body-header">
              <em>2 &mdash;</em> Name this doorway
            </h2>
            <p className="account-setup-doorway-detail-body-section">
              Create a name for this doorway to be used in the Dashboard.
            </p>
            <label
              className="account-setup-doorway-detail-body-input-label"
              htmlFor="account-setup-doorway-detail-body-doorway-name"
            >Doorway Name</label>
            <InputBox
              className="account-setup-doorway-detail-body-input"
              placeholder="Doorway Name"
              onChange={e => this.setState({doorway: {...this.state.doorway, name: e.target.value}})}
              value={this.state.doorway.name}
            />


            <h2 className="account-setup-doorway-detail-body-header">
              <em>3 &mdash;</em>
              Measure your doorway
            </h2>
            <p className="account-setup-doorway-detail-body-section">
              Please provide a height and width measurement.
            </p>
            <div className="account-setup-doorway-detail-body-guidelines-box">
              <ul>
                <li>Height measurements should be from floor to top of door frame</li>
                <li>Width measurements should be from frame to frame</li>
                <li>Mounting space above door should be at least 5in</li>
              </ul>
            </div>

            <div className="account-setup-doorway-detail-body-measurement-radio-container">
              <RadioButton
                text="Metric"
                checked={this.state.measurementUnit === METRIC}
                onChange={() => {
                  this.setState({
                    measurementUnit: METRIC,
                    inputWidth: this.state.inputWidth * CENTIMETERS_PER_INCH,
                    inputHeight: this.state.inputHeight * CENTIMETERS_PER_INCH,
                  });
                }}
              />
              <RadioButton
                text="Imperial"
                checked={this.state.measurementUnit === IMPERIAL}
                onChange={() => {
                  this.setState({
                    measurementUnit: IMPERIAL,
                    inputWidth: parseFloat(this.state.inputWidth, 10) / CENTIMETERS_PER_INCH,
                    inputHeight: parseFloat(this.state.inputHeight, 10) / CENTIMETERS_PER_INCH,
                  });
                }}
              />
            </div>
            <br/>

            <label className="account-setup-doorway-detail-body-input-label">
              Doorway Width
              <span className="account-setup-doorway-detail-body-input-label-highlight">
                {this.state.measurementUnit === METRIC ? '(Centimeters)' : '(Inches)'}
              </span>
            </label>
            <InputBox
              className="account-setup-doorway-detail-body-input"
              placeholder={this.state.measurementUnit === METRIC ? 'cm' : 'inches'}
              value={this.state.inputWidth}
              onChange={e => this.setState({inputWidth: e.target.value})}
            />

            <br/>
            <label className="account-setup-doorway-detail-body-input-label">
              Doorway Height
              <span className="account-setup-doorway-detail-body-input-label-highlight">
                {this.state.measurementUnit === METRIC ? '(Centimeters)' : '(Inches)'}
              </span>
            </label>
            <InputBox
              className="account-setup-doorway-detail-body-input"
              placeholder={this.state.measurementUnit === METRIC ? 'cm' : 'inches'}
              value={this.state.inputHeight}
              onChange={e => this.setState({inputHeight: e.target.value})}
            />

            <br/>
            <label
              className="account-setup-doorway-detail-body-input-label mounting-space"
            >Mounting space</label>
            <p className="account-setup-doorway-detail-body-section-clearance">
              Does this doorway have at least 5in (0.13m) of clearance above the door to mount a unit?
            </p>

            <MountingSpaceGraphic />

            <div className="account-setup-doorway-detail-body-clearance-radio-container">
              <RadioButton
                text="Yes"
                checked={this.state.doorway.environment.clearance === true}
                onChange={() => this.setState({
                  doorway: {
                    ...this.state.doorway,
                    environment: {...this.state.doorway.environment, clearance: true},
                  },
                })}
              />
              <RadioButton
                text="No"
                checked={this.state.doorway.environment.clearance === false}
                onChange={() => this.setState({
                  doorway: {
                    ...this.state.doorway,
                    environment: {...this.state.doorway.environment, clearance: false},
                  },
                })}
              />
            </div>

            <h2 className="account-setup-doorway-detail-body-header">
              <em>4 &mdash;</em>
              Choose a power option
            </h2>

            <p className="account-setup-doorway-detail-body-section-clearance">
              How will you power the unit?
            </p>
            <RadioButton
              text="Power over Ethernet (PoE)"
              checked={this.state.doorway.environment.powerType === POWER_OVER_ETHERNET}
              onChange={() => this.setState({
                doorway: {
                  ...this.state.doorway,
                  environment: {...this.state.doorway.environment, powerType: POWER_OVER_ETHERNET},
                },
              })}
            />
            <div className="account-setup-doorway-detail-body-power-radio-button-spacer" />
            <RadioButton
              text="Standard 100-240V AC outlet"
              checked={this.state.doorway.environment.powerType === AC_OUTLET}
              onChange={() => this.setState({
                doorway: {
                  ...this.state.doorway,
                  environment: {...this.state.doorway.environment, powerType: AC_OUTLET},
                },
              })}
            />
            <br/>
            <br/>
            <br/>
            <br/>

            <Button onClick={() => {
              return this.props.onSave(this.formattedDoorway()).then(() => {
                // Once complete, open the doorway saved modal.
                this.props.openDoorwaySavedModal();

                // and redirect back to the main page.
                window.location.href = '#/account/setup/doorways';
              });
            }}>Save &amp; Close</Button>
            <Button className="account-setup-doorway-detail-save-add-another-button" onClick={() => {
              return this.props.onSave(this.formattedDoorway()).then(() => {
                // Once complete, reset the state of the form.
                this.setState({doorway: {}});

                // Once complete, redirect to new doorway page
                window.location.href = '#/account/setup/doorways/new';
              });
            }}>Save &amp; Add Another Doorway</Button>
          </CardBody>
        </Card>
      </div>
    </div>;
  }
}

function MountingSpaceGraphic() {
  return <svg
    className="account-setup-doorway-detail-clearance-graphic"
    width="422px"
    height="217px"
    viewBox="0 0 422 217"
    version="1.1"
  >
    <g id="Onboarding-Web" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="ob-v1-r1-004-1" transform="translate(-429.000000, -2535.000000)">
            <g id="content" transform="translate(410.000000, 370.000000)">
                <g id="step-3" transform="translate(20.000000, 1519.000000)">
                    <g id="scene" transform="translate(0.000000, 647.000000)">
                        <rect id="door" stroke="#B4B8BF" fill="#F5F6F7" strokeLinecap="round" strokeLinejoin="round" x="0" y="61.4299828" width="420" height="154.078481"></rect>
                        <rect id="door" stroke="#B4B8BF" fill="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" x="21.0501193" y="82.5780097" width="378.902148" height="132.930455"></rect>
                        <g id="r60-front" transform="translate(185.441527, 28.197369)" stroke="#B4B8BF">
                            <path d="M15.3787213,11.0775379 L37.7477704,11.0775379 L37.7477704,31.2326136 L37.7477704,31.2326136 C37.7477704,32.3371831 36.8523399,33.2326136 35.7477704,33.2326136 L17.3787213,33.2326136 L17.3787213,33.2326136 C16.2741518,33.2326136 15.3787213,32.3371831 15.3787213,31.2326136 L15.3787213,11.0775379 Z" id="mount" fill="#F5F6F7" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M0.162956884,20.7703835 C1.30923909,22.6166398 2.29345712,23.539768 3.11561097,23.539768 C4.34884174,23.539768 48.5271043,23.3910693 49.8183736,23.3910693 C50.6792198,23.3910693 51.7517142,22.5175074 53.0358569,20.7703835 L0.162956884,20.7703835 Z" id="window" fill="#B4B8BF" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M0.965858065,2.85340573 C0.54871463,5.70544631 0.266651737,8.56472301 0.119669386,11.4312358 C-0.0398897952,14.5430274 -0.0398897952,17.6560766 0.119669386,20.7703835 L53.0227182,20.7703835 C53.1610828,17.6282524 53.1610828,14.5084501 53.0227182,11.4109765 C52.8952077,8.55648453 52.6493786,5.70281009 52.2852309,2.84995315 L52.2852338,2.84995279 C52.2297872,2.41556544 51.8981613,2.06778413 51.4669003,1.99175359 C43.935141,0.663917864 35.9940108,0 27.6435097,0 C19.2560581,0 10.6433742,0.669806479 1.80545792,2.00941944 L1.80545924,2.00942813 C1.37037955,2.07537561 1.02954271,2.41798907 0.965858065,2.85340573 Z" id="enclosure" fill="#F5F6F7" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M1.39806557,4.15407671 C9.78645899,3.23094855 18.1748524,2.76938447 26.5632458,2.76938447 C34.9516392,2.76938447 43.3400327,3.23094855 51.7284261,4.15407671" id="curve" strokeWidth="0.5" strokeDasharray="2"></path>
                        </g>
                        <g id="measurements" transform="translate(105.250597, 0.000000)">
                            <polyline id="Path-11" stroke="#4198FF" points="56.9945046 61.0564073 46.1018586 61.0564073 46.1018586 0.00272682807 56.9945046 0.00272682807"></polyline>
                            <text id="5-in" fontFamily=".AppleSystemUIFont" fontSize="14" fontWeight="normal" fill="#4198FF">
                                <tspan x="5.54118889" y="30.4533413">5 in</tspan>
                            </text>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </svg>
}

export default connect(state => {
  return {
    initialDoorway: state.doorways.selected === 'new' ? {} :
      state.doorways.data.find(doorway => doorway.id === state.doorways.selected),
    doorwayCollectionLoading: state.doorways.loading,
  };
}, dispatch => {
  return {
    onSave(doorway) {
      if (doorway.id) {
        return dispatch(collectionDoorwaysUpdate(doorway));
      } else {
        return dispatch(collectionDoorwaysCreate(doorway));
      }
    },
    openDoorwaySavedModal() {
      dispatch(showModal('unit-setup-added-doorway'));
    },
  };
})(function AccountSetupDoorwayDetailWrapper(props) {
  if (typeof props.initialDoorway !== 'undefined') {
    return <AccountSetupDoorwayDetail {...props} />;
  } else {
    return <div className="account-setup-doorway-detail-loading">Loading ...</div>;
  }
});
