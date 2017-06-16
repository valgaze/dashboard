import assert from 'assert';
import objectSnakeToCamel from './';

describe('object-snake-to-camel', function() {
  it('should work', function() {
    const actual = {
      fooBar: 'baz',
      alreadyCamel: 'bla',
    };

    const input = {
      foo_bar: 'baz',
      alreadyCamel: 'bla',
    };

    assert.deepEqual(objectSnakeToCamel(input), actual);
  });
});

