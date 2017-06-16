export const SESSION_TOKEN_SET = 'SESSION_TOKEN_SET';

export default function sessionTokenSet(token) {
  return { type: SESSION_TOKEN_SET, token };
}
