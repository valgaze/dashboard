import userPush from '../../actions/user/push';

export default store => {

  return function setSettingsFlag(flag, value) {
    const user = store.getState().user.user;
    if (!user) {
      throw new Error('Please wait for the user collection to load before changing settings flags.');
    }

    const settings = { [flag]: value };
    store.dispatch(userPush({
      ...user,
      organization: {
        ...user.organization,
        settings: {...user.settings, ...settings},
      },
    }));
  }

}
