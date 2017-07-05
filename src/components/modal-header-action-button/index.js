import * as React from 'react';
import classnames from 'classnames';

export default function ModalHeaderActionButton({onClick, children, className}) {
  return <div
    onClick={onClick}
    className={classnames('modal-header-action-button', className)}
  >{children}</div>;
}
