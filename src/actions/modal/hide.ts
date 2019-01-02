export const HIDE_MODAL = 'HIDE_MODAL';

export default function hideModal(name = null) {
  return { type: HIDE_MODAL, name };
}
