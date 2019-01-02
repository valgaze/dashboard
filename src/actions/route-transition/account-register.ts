import { decode } from '../../helpers/url-safe-base64/index'

export const ROUTE_TRANSITION_ACCOUNT_REGISTER = 'ROUTE_TRANSITION_ACCOUNT_REGISTER';

export default function routeTransitionAccountRegister(slug) {
  return {
    type: ROUTE_TRANSITION_ACCOUNT_REGISTER,
    body: decode(slug),
  };
}
