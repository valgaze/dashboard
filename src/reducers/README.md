# Reducers

Reducers are located within `src/reducers`. Each file `default`ly exports its reducer:

```
src/reducers/
└── my-reducer
    ├── README.md     // Documentation for the reducer
    ├── test.js       // Tests for the reducer
    └── index.js      // The reducer itself
```

In some cases, such as the `sessionToken` reducer, we're using reducer enhancers. Reducer enhancers
are a great way to allow a reducer to "sync" with another resource (in the case of `sessionToken`,
we use the `localstorage-reducer-enhancer` helper to duplicate data in `localStorage`). Use them
sparingly though, since technically this gives your reducer a side effect, though the nice thing
about a reducer enhancer is that the side effect is cleanly seperated from the reducer code so it
doesn't "feel" like it has a side effect. I digress.

There are a few main types of reducers in this project.


## Collection reducers
Collections are a central data storage concept in this project. Essentially, they are a way of
storing an array of objects in a consistent fashion, and include baked in ways of doing common
things, such as a loading interval, filters, paging, etc.

A few examples of this reducer type include `spaces`, `links`, `tokens` and `doorways`.

## General structure
A collection has two parts - the actions and the reducer.

Each collection reducer has a common structure:
```json
{
  "filters": {
    "filterOne": "value"
  },
  "data": [],
  "loading": true
}
```

This structure not only makes it easy to predict where data will be found but alsp provides a
structure that is easy to expand upon as new features must be implemented.

## Auto-conversion of data from snake_case to camelCase in reducers 
Most of our backend services at Density return data in snake case (lowercase and
underscore-separated). While it's perfectly valid to work with data in the format within the
frontend code, it doesn't match with the typical javascript conventions of camelcase variable names.
Therefore, each collection pipes its data through the helper called object-snake-to-camel, which
does this conversion for us. In other projects, the concept of a mapper, serializer, or marshaller
exists, which is a concept used to convert data coming into the system into a representation that
the system can parse, and convert data from the internal representation back into a representation
that an external system can use. At least in this project, reducer-specific mappers haven't been
required *yet*, and relying on `object-snake-to-camel` has been good enough. This isn't to say that
this is how it will always work, but IMO, it's great to keep data in roughly the same representation
everywhere.
