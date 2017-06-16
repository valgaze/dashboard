<!--
<img src="https://cdn.rawgit.com/DensityCo/web-dashboard/master/logo.svg" height="50" />
<br />
-->

# Web Dashboard

[![CircleCI](https://circleci.com/gh/DensityCo/web-dashboard.svg?style=shield&circle-token=1b5ece9522df300da10bcedd91a24b6f066b9049)](https://circleci.com/gh/DensityCo/web-dashboard)
[![Dependency
Status](https://david-dm.org/densityco/nicss.svg)](https://david-dm.org/densityco/web-dashboard)
<!-- ![License](https://img.shields.io/badge/License-MIT-green.svg) -->


This project is react based, and uses redux for state management.

*NOTE*: all the conventions below are still in flux (ha, get it, redux joke!), and it you have
contrary opinions let me know.

## Components

Components in the project are located within the `src/components` folder and are stored as a
flat folder list. Styles and component code are stored side-by-side:

```
src/components/
├── app
│   ├── README.md
│   ├── _styles.scss
│   └── index.js
└── my-component
    ├── README.md     // Documentation for the component
    ├── _styles.scss  // Styles for the component, scoped to the component
    └── index.js      // The component logic
```

We're trying out this cool idea called [Documentation Driven
Development](https://collectiveidea.com/blog/archives/2014/04/21/on-documentation-driven-development). At a high level, it doesn't change things much:
- Create your component
- Write out a brief summary of the component's intended function. What does it manage? Is it
  presentational or stateful? Are there any intended dependencies?
- Then, try to implement the component according to the documentation. If things have to change,
  that's fine, just update the documentation prior to making the change.

Advantages to the above approach:
- Writing docs prior to writing code helps clarify the code that's about to be written.
- You're always thinking about documentation, even after writing the component.

## Reducers

Reducers are located within `src/reducers`. Each file `default`ly exports its reducer:

```
src/reducers/
├── foo.js
├── bar.js
└── baz.js
```

In some cases, such as the `sessionToken` reducer, we're using reducer enhancers. Reducer enhancers
are a great way to allow a reducer to "sync" with another resource (in the case of `sessionToken`,
we use the `localstorage-reducer-enhancer` helper to duplicate data in `localStorage`). Use them
sparingly though, since technically this gives your reducer a side effect, though the nice thing
about a reducer enhancer is that the side effect is cleanly seperated from the reducer code so it
doesn't "feel" like it has a side effect. I digress.

## Action creators 

Action creators are located within `src/actions`. Use subfolders as required to nest hierarchically and
attempt to use the names `list`, `update`, `delete`, `read`, and `create` (CRUD) when possible.

Action names should be constants and be defined in the file with their action creator. If an action
has multiple action creators, they should be in the same file (ie, one file per action not action
creator).

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

## Helpers

Helpers are in the `src/helpers` folder. Each helper has it's own folder containing an `index.js`
for the helper code and a `test.js` for a test (or multiple) for that helper.

```
src/helpers/
├── foo
│   ├── test.js
│   └── index.js
└── bar
    ├── test.js
    └── index.js
```

So why test these? Well, they should be pure or have managed side effects, and therefore really easy
to test. We need to head in the direction of testing this project since it'll be publiclly visible
at some point so I figured this is a good place to start. We can also test reducers / action
creators, but until we finalize those it's probably best to hold off. Let me know your thoughts.

A good candidates for a helper is a pure, reusable function. It's fine if it's only used in one
place, one of the aims of making helpers more "official" is to promote their use in multiple places
and since they have to follow a spec their functionality shouldn't change.

# Styles
Many styles and associated variables are brought in from `@density/ui`, our UI framework.

```scss
// src/styles.scss, the main stylesheet

// CSS reset - normalize.css
@import "../node_modules/normalize.css/normalize.css";

// Global variables like colors, spacings, etc...
@import "../node_modules/@density/ui/variables/colors.json";
@import "../node_modules/@density/ui/variables/spacing.json";
// (etc...)

// Here's an example component - a navbar. See how variables are required first for the component
// then the scss for the component which uses those variables is brought in.
@import "../node_modules/@density/ui-navbar/variables.json";
@import "../node_modules/@density/ui-navbar/dist/sass";
```
