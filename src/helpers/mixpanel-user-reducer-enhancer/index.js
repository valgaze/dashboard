import mixpanelInitialize from '../mixpanel-initialize/index';

export default function mixpanelUserReducerEnhancer(reducer) {
  return (state, props) => {
    const result = reducer(state, props);

    if (result.user && process.env.REACT_APP_MIXPANEL_TOKEN) {
      // Initialize mixpanel
      mixpanelInitialize();

      // Update the user on mixpanel if the user info changed.
      window.mixpanel.identify(result.user.id);
      window.mixpanel.people.set(result.user.id, {
         $first_name: result.user.fullName,
         $last_name: '',
         email: result.user.email,
         organization_id: result.user.organization.id,
         organization_name: result.user.organization.name,
         is_admin: result.user.is_admin,
      });
    }

    return result;
  };
}
