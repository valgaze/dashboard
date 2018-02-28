import mixpanelInitialize from '../mixpanel-initialize/index';

export default function mixpanelUserReducerEnhancer(reducer) {
  return (state, props) => {
    const result = reducer(state, props);

    if (result.data && process.env.REACT_APP_MIXPANEL_TOKEN) {
      // Initialize mixpanel
      mixpanelInitialize();

      // Update the user on mixpanel if the user info changed.
      // "Organization" is capitalized for consistency across multiple products
      // Database field names should always be underscores and lowercase
      window.mixpanel.identify(result.user.id);
      window.mixpanel.people.set({
         $name: result.data.fullName,
         $email: result.data.email,
         Organization: result.data.organization.name,
         organization_id: result.data.organization.id,
         is_admin: result.data.is_admin,
      });
    }

    return result;
  };
}
