import React from 'react';

export default function NewExploreList({
  name,
}) {
  return <div className="new-explore-list">
    {name ? `Hello ${name}` : 'Hello World!'}
  </div>;
}
