export const REDIRECT_AFTER_LOGIN = 'REDIRECT_AFTER_LOGIN';

export default function redirectAfterLogin(hash) {
  return {
    type: REDIRECT_AFTER_LOGIN,
    hash: hash
  };
}
