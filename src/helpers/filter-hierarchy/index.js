export function getParentsOfSpace(spaces, space) {
  const parents = [];

  if (!space) {
    throw new Error(`Invalid space passed to getParentsOfSpace`);
  }

  while (true) {
    parents.push(space.id);

    if (typeof space.parentId === 'undefined' || space.parentId === null) {
      return parents;
    }

    const parentId = space.parentId;
    // eslint-disable-next-line no-loop-func
    space = spaces.find(s => s.id === space.parentId);
    if (!space) {
      throw new Error(`No such space found with id ${parentId}`);
    }
  }
}

export default function filterHierarchy(spaces, parentId) {
  return spaces.filter(space => {
    return (
      space.spaceType === 'space' && /* must be of type space */
      getParentsOfSpace(spaces, space).indexOf(parentId) > 0 /* index 0 = current space */
    );
  });
}
