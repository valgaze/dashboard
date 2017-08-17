import * as React from 'react';
import classnames from 'classnames';

export default function FormLabel({label, input, htmlFor, className, editable}) {
  editable = typeof editable === 'undefined' ? true : editable;
  return <div className={classnames('form-label', editable ? 'form-label-editable' : null, className)}>
    <label className="form-label-label" htmlFor={htmlFor}>{label}</label>
    {input}
  </div>;
}
