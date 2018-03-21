# Helpers

Helpers are in the `src/helpers` folder. Each helper has it's own folder containing an `index.js`
for the helper code and a `test.js` for a test (or multiple) for that helper.

```
src/helpers/
├── foo
│   ├── test.js
│   └── index.js
└── bar
    ├── test.js
    └── index.js
```

A good candidates for a helper is a pure, reusable function. It's fine if it's only used in one
place, one of the aims of making helpers more "official" is to promote their use in multiple places
and since they have to follow a spec their functionality shouldn't change.
