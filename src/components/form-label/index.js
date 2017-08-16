import * as React from 'react';
import classnames from 'classnames';

export default function FormLabel({label, input, htmlFor, className}) {
  return <div className={classnames('form-label', className)}>
    <label className="form-label-label" htmlFor={htmlFor}>{label}</label>
    {input}
  </div>;
}
