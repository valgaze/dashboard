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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non sem semper, sagittis dolor sit amet, commodo augue. Fusce quis finibus sem, a egestas nisi. Ut semper, velit sed bibendum congue, sapien dui tempor mi, id rhoncus tortor tellus at leo. Suspendisse gravida turpis et congue dictum. Curabitur tempus augue enim, quis euismod ex porttitor a. Nam facilisis nunc sem, nec efficitur dolor volutpat sit amet. Nulla eu arcu sagittis nulla lacinia egestas. Phasellus venenatis sapien urna, in blandit orci convallis nec. Nulla sed nisi in turpis sagittis aliquet ut in tortor. In vehicula libero eget massa pulvinar hendrerit. Nullam dictum justo mi, et posuere nisl sodales sed. Etiam pulvinar tortor massa, sed pellentesque turpis ullamcorper at. Donec ut dapibus arcu. Mauris faucibus ut nulla non luctus. Donec a nulla vitae tortor efficitur posuere et vel nisl. Pellentesque non augue tellus.

            Nullam lectus purus, pretium in varius sit amet, feugiat in lorem. Maecenas pulvinar sem ut odio vehicula pulvinar. Morbi malesuada, tellus ac cursus finibus, nisi metus lacinia neque, vitae mollis sem leo sed leo. Vestibulum ornare nisi in varius commodo. Suspendisse facilisis, elit at interdum mollis, nisi eros porta orci, id congue nulla sem quis eros. Duis quis turpis pulvinar, rhoncus ex nec, fringilla quam. Morbi ac elementum diam. Curabitur vel turpis nec eros tincidunt consequat. Fusce ultricies tellus risus, ut maximus risus hendrerit sit amet. Etiam finibus lorem eu justo varius pretium. Praesent blandit lectus non lectus convallis pellentesque. Nullam rutrum non libero sed ultricies. Ut consequat pretium aliquam.
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
