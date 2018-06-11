import React from 'react';

export default function SpaceHierarchySelectBox({
  value,
  onChange,
}) {
  return <div className="space-hierarchy-select-box">
    {value ? value.name : ''}
    <button onClick={() => onChange({id: 'spc_542342519195697369'})}>change</button>
  </div>;
}
