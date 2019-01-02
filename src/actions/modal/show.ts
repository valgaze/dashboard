export const SHOW_MODAL = 'SHOW_MODAL';

export default function showModal(name, data={}) {
  return { type: SHOW_MODAL, name, data};
}
