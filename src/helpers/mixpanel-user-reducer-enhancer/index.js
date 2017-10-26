import mixpanelInitialize from '../mixpanel-initialize/index';

export default function mixpanelUserReducerEnhancer(reducer) {
  return (state, props) => {
    const result = reducer(state, props);

    if (result.user && process.env.REACT_APP_MIXPANEL_TOKEN) {
      // Initialize mixpanel
      mixpanelInitialize();

      // Update the user on mixpanel if the user info changed.
      // "Organization" is capitalized for consistency across multiple products
      window.mixpanel.identify(result.user.id);
      window.mixpanel.people.set({
         $name: result.user.fullName,
         $email: result.user.email,
         Organization: result.user.organization.name,
         organization_id: result.user.organization.id,
         is_admin: result.user.is_admin,
      });
    }

    return result;
  };
}
