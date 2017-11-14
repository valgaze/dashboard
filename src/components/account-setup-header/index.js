import * as React from 'react';

export default function AccountSetupHeader({
  greeter,
  detail,
}) {
  return <div className="account-setup-header-container">
    <div className="account-setup-header">
      <div className="account-setup-header-greeter">{greeter}</div>
      <div className="account-setup-header-detail">{detail}</div>
    </div>
  </div>;
}
