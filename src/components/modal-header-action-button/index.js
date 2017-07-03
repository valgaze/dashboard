import * as React from 'react';

export default function ModalHeaderActionButton({onClick, children}) {
  return <div onClick={onClick} className="modal-header-action-button">{children}</div>;
}
