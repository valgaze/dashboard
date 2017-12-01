import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@density/ui-button';
import Card, { CardBody } from '@density/ui-card';
import Subnav, { SubnavItem } from '../subnav/index';

import AccountSetupHeader from '../account-setup-header/index';

export function AccountSetupOverview({user, onGetStarted}) {
  if (user.user) {
    return <div className="account-setup-overview-container">
      <Subnav visible>
        <SubnavItem active href="#/account/setup/overview">Overview</SubnavItem>
        <SubnavItem href="#/account/setup/doorways">Doorways</SubnavItem>
      </Subnav>

      <AccountSetupHeader
        greeter={`Welcome, ${user.user.nickname || user.user.fullName}`}
        detail="Let's prep your space for installation."
      />

      <div className="account-setup-overview-body-container">
        <h1 className="account-setup-overview-title">Onboarding overview</h1>
        <Card className="account-setup-overview-body">
          <CardBody>
            To ensure a successful installation, we have three onboarding steps to complete.

            Here's what you should expect:

            <ul className="account-setup-overview-body-list">
              <li>Confirming your doorway(s)</li>
              <li>
                Installing the unit
                <span className="account-setup-overview-body-emphesis">
                  (after doorway assessment)
                </span>
              </li>
              <li>
                Configuring the unit
                <span className="account-setup-overview-body-emphesis">
                  (after unit installation)
                </span>
              </li>
            </ul>

            Once onboarding is complete, Insights will be made available in the Dashboard.

            <div className="account-setup-overview-glyph">
              <img
                src="https://densityco.github.io/assets/images/r60-angle.06524db8.svg"
                alt=""
              />
            </div>
            <Button className="account-setup-overview-submit" onClick={onGetStarted}>Lets Get Started!</Button>
          </CardBody>
        </Card>
      </div>
    </div>;
  } else if (user.loading) {
    return <div className="account-setup-overview account-setup-overview-loading">
      Loading user information...
    </div>;
  } else {
    return <div className="account-setup-overview account-setup-overview-loading">
      No user found.
    </div>;
  }
}

export default connect(state => {
  return { user: state.user };
}, dispatch => {
  return {
    // Move to the doorway list page in the setup flow.
    onGetStarted() {
      window.location.href = '#/account/setup/doorways';
    },
  };
})(AccountSetupOverview);
