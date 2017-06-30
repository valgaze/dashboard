# Reducers

There are a few main types of reducers in this project.


## Collection reducers
Collections are a central data storage concept in this project. Essentially, they are a way of
storing an array of objects in a consistent fashion, and include baked in ways of doing common
things, such as a loading interval, filters, paging, etc.

A few examples of this reducer type include `spaces`, `links`, `tokens` and `doorways`.

## General structure
A collection has two parts - the actions and the reducer.

Each reducer has a common structure:
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
