export const ROUTE_TRANSITION_ACCOUNT_FORGOT_PASSWORD = 'ROUTE_TRANSITION_ACCOUNT_FORGOT_PASSWORD';

export default function routeTransitionAccountForgotPassword(resetToken) {
  return {
    type: ROUTE_TRANSITION_ACCOUNT_FORGOT_PASSWORD,
    body: resetToken,
  };
}
