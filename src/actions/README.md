# Action creators 

Action creators are located within `src/actions`. Use subfolders as required to nest hierarchically and
attempt to use the names `list`, `update`, `delete`, `read`, and `create` (CRUD) when possible.

Action names should be constants and be defined in the file with their action creator. If an action
has multiple action creators, they should be in the same file (ie, one file per action not action
creator).

Action names should be predictable. An action in `src/actions/foo/bar/baz.js` should have the name
`FOO_BAR_BAZ`.

In the case of a thunk (such as a data loading, or something else that happens async), it may make
sense to `default`ly export the thunk and either provide the deferred action as a named export or
keep it private.

```
src/actions/
├── spaces
│   ├── count.js
│   ├── list.js
│   └── update.js
└── doorways
    ├── list.js
    └── update.js
```
