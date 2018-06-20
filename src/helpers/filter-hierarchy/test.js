import assert from 'assert';
import filterHierarchy, { getParentsOfSpace } from './index';

describe('filter-hierarchy', function() {
  describe('getParentsOfSpace', function() {
    const hierarchy = [
      {name: 'Food', id: 0, parentId: null},
        {name: 'Pickled things', id: 1, parentId: 0},
          {name: 'Pickles', id: 2, parentId: 1},
          {name: 'Sour crout', id: 3, parentId: 1},
          {name: 'Relish', id: 4, parentId: 1},
        {name: 'Fruits', id: 5, parentId: 0},
          {name: 'Apples', id: 6, parentId: 5},
            {name: 'Macintosh', id: 7, parentId: 6},
            {name: 'Granny Smith', id: 8, parentId: 6},
            {name: 'Gala', id: 9, parentId: 6},
          {name: 'Banannas', id: 10, parentId: 5},
          {name: 'Peaches', id: 11, parentId: 999999999}, /* has an invalid parent node! */
        {name: 'Calamari', id: 12, parentId: 0},
    ];

    it('should get all parents of a space in a tree', function() {
      const grannySmith = hierarchy.find(i => i.name === 'Granny Smith');
      assert.deepEqual(
        getParentsOfSpace(hierarchy, grannySmith),
        [8, 6, 5, 0], /* Granny Smith, Apples, Fruits, Food */
      );
    });
    it('should throw an error if a node in the tree cannot be found', function() {
      const peaches = hierarchy.find(i => i.name === 'Peaches');
      assert.throws(() => {
        getParentsOfSpace(hierarchy, peaches);
      }, 'No such space found with id 999999999');
    });
    it('should only return the root node when given the root node', function() {
      const food = hierarchy.find(i => i.name === 'Food');
      assert.deepEqual(
        getParentsOfSpace(hierarchy, food),
        [0], /* Food */
      );
    });
    it('should throw an error if an invalid space is passed to the function', function() {
      assert.throws(() => {
        getParentsOfSpace(hierarchy, null);
      }, 'Invalid space passed to getParentsOfSpace');
    });
    it('should not infinitely loop if given bad data', function() {
      assert.deepEqual(
        getParentsOfSpace([{id: 0, /* no parentId! */}], {id: 0}),
        [0],
      );

      assert.deepEqual(
        getParentsOfSpace([], {id: 0}),
        [0],
      );
    });
    it('should not infinitely loop if given cyclical data', function() {
      assert.throws(() => {
        getParentsOfSpace([
          {id: 0, parentId: 1}, /* 0 => 1 => 0 => 1 => ... */
          {id: 1, parentId: 0},
        ], {id: 0, parentId: 1});
      }, /Cyclical space hierarchy detected! This isn't allowed./);
    });
  });
  describe('filterHierarchy', function() {
    const hierarchy = [
      {name: 'Food', id: 0, parentId: null, spaceType: 'building'},
        {name: 'Pickled things', id: 1, parentId: 0, spaceType: 'floor'},
          {name: 'Pickles', id: 2, parentId: 1, spaceType: 'space'},
          {name: 'Sour crout', id: 3, parentId: 1, spaceType: 'space'},
          {name: 'Relish', id: 4, parentId: 1, spaceType: 'space'},
        {name: 'Fruits', id: 5, parentId: 0, spaceType: 'floor'},
          {name: 'Apples', id: 6, parentId: 5, spaceType: 'space'},
            {name: 'Macintosh', id: 7, parentId: 6, spaceType: 'space'},
            {name: 'Granny Smith', id: 8, parentId: 6, spaceType: 'space'},
            {name: 'Gala', id: 9, parentId: 6, spaceType: 'space'},
          {name: 'Banannas', id: 10, parentId: 5, spaceType: 'space'},
          {name: 'Peaches', id: 11, parentId: 5, spaceType: 'space'},
        {name: 'Calamari', id: 12, parentId: 0, spaceType: 'floor'},
    ];

    it('should filter based on a space parent of Relish, a leaf node', function() {
      assert.deepEqual(
        filterHierarchy(hierarchy, 4), /* 4 = Relish */
        []
      );
    });
    it('should filter based on a space parent of fruit, a mid-level node', function() {
      assert.deepEqual(
        filterHierarchy(hierarchy, 5), /* 5 = Fruits */
        [
          {name: 'Apples', id: 6, parentId: 5, spaceType: 'space'},
          {name: 'Macintosh', id: 7, parentId: 6, spaceType: 'space'},
          {name: 'Granny Smith', id: 8, parentId: 6, spaceType: 'space'},
          {name: 'Gala', id: 9, parentId: 6, spaceType: 'space'},
          {name: 'Banannas', id: 10, parentId: 5, spaceType: 'space'},
          {name: 'Peaches', id: 11, parentId: 5, spaceType: 'space'},
        ],
      );
    });
    it('should filter based on a space parent of food, a top-level node', function() {
      assert.deepEqual(
        filterHierarchy(hierarchy, 0), /* 0 = Food */
        [
          {name: 'Pickles', id: 2, parentId: 1, spaceType: 'space'},
          {name: 'Sour crout', id: 3, parentId: 1, spaceType: 'space'},
          {name: 'Relish', id: 4, parentId: 1, spaceType: 'space'},
          {name: 'Apples', id: 6, parentId: 5, spaceType: 'space'},
          {name: 'Macintosh', id: 7, parentId: 6, spaceType: 'space'},
          {name: 'Granny Smith', id: 8, parentId: 6, spaceType: 'space'},
          {name: 'Gala', id: 9, parentId: 6, spaceType: 'space'},
          {name: 'Banannas', id: 10, parentId: 5, spaceType: 'space'},
          {name: 'Peaches', id: 11, parentId: 5, spaceType: 'space'},
        ],
      );
    });
  });
});
