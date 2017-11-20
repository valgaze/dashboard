import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@density/ui-button';
import Card, { CardBody, CardLoading } from '@density/ui-card';
import Subnav, { SubnavItem } from '../subnav/index';

import AccountSetupHeader from '../account-setup-header/index';

export function AccountSetupDoorwayList({
  doorways,

  onCreateDoorway,
}) {
  return <div className="account-setup-doorway-list">
    <Subnav visible>
      <SubnavItem href="#/account/setup/overview">Overview</SubnavItem>
      <SubnavItem active >Doorways</SubnavItem>
    </Subnav>

    <AccountSetupHeader
      greeter="Doorways"
      detail="Provide more information about your doorways to guide installation."
    />

    <div className="account-setup-doorway-list-body-container">
      <h1 className="account-setup-doorway-list-title">
        Your Doorways
        <span
          className="account-setup-doorways-list-add-doorway-link"
          role="button"
          onClick={onCreateDoorway}
        >Add a doorway</span>
      </h1>
      <Card className="account-setup-doorway-list-body">
        {/* If the doorways collection is still loading, show the card in a loading state */}
        {doorways.loading ? <CardLoading indeterminate /> : null}

        {/* The doorway list */}
        {(function(doorways) {
          if (doorways.data.length > 0) {
            return <CardBody>
              <ul className="account-detail-doorway-list">
                {doorways.data.map(doorway => {
                  return <li key={doorway.id}>
                    <a
                      className="account-setup-doorway-list-item"
                      href={`#/account/setup/doorways/${doorway.id}`}
                    >
                      {doorway.insideImageUrl ? <img
                        className="account-setup-doorway-list-item-image"
                        src={doorway.insideImageUrl}
                        alt="Front of doorway"
                      /> : <div className="account-setup-doorway-list-item-image empty" />}

                      <span className="account-setup-doorway-list-item-name">
                        {doorway.name}
                      </span>

                      <span className="account-setup-doorway-list-item-arrow">&#59651;</span>
                    </a>
                  </li>;
                })}
              </ul>
            </CardBody>;
          } else if (doorways.loading) {
            return <CardBody>Loading doorways...</CardBody>;
          } else {
            // When no doorways are visible, add a button to create the first doorway.
            return <CardBody>
              <Button
                className="account-setup-doorway-list-create"
                onClick={onCreateDoorway}
              >
                Create your first doorway
              </Button>
            </CardBody>;
          }
        })(doorways)}
      </Card>
    </div>
  </div>;
}

export default connect(state => {
  return { doorways: state.doorways };
}, dispatch => {
  return {
    onCreateDoorway() {
      window.location.href = '#/account/setup/doorways/new';
    },
  };
})(AccountSetupDoorwayList);
