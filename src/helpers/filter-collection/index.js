import fuzzy from 'fuzzy';

function joinKeys(item, keys) {
  return keys.reduce((all, k) => `${all} ${item[k]}`, '');
}

export default function filterCollection({fields}) {
  fields = fields || ['name'];
  return (collection, query, sortMethod) => {
    if (query) {
      const collectionSearchQueries = collection.map(item => joinKeys(item, fields));
      const output = fuzzy.filter(query, collectionSearchQueries);
      return output.map(i => collection[i.index]);
    } else {
      return collection;
    }
  }
}
