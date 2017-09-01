import * as React from 'react';
import classnames from 'classnames';
import Toast from '@density/ui-toast';

export default class EnvironmentSpaceDismissableToast extends React.Component {
  render() {
    const key = this.props.storageKey;
    const restProps = Object.assign({}, this.props, {storageKey: undefined});

    // Should the toast be shown?
    let visible = true;
    if (window.localStorage) {
      if (window.localStorage[`environmentSpaceDismissableToast_${key}`] === 'false') {
        visible = false;
      }

      // Set the localstorage keys on each render.
      window.localStorage[`environmentSpaceDismissableToast_${key}`] = visible ? 'true' : 'false';
    }

    return visible ? <div className="environment-space-dismissable-toast">
      <div className="environment-space-dismissable-toast-delete" onClick={() => {
        // On dismiss, 
        window.localStorage[`environmentSpaceDismissableToast_${key}`] = 'false';
        this.forceUpdate();
      }}>&times;</div>
      <Toast {...restProps} className={classnames('environment-space-dismissable-toast-toast', this.props.className)}/> 
    </div> : null;
  }
}
