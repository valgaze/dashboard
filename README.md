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

## Action creators 

Actions are located within `src/actions`. Use subfolders as required to nest hierarchically and
attempt to use the names `list`, `update`, `delete`, `read`, and `create` (CRUD) when possible:

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




# Styles
Many styles and associated variables are brought in from `@density/ui`, our UI framework.

```scss
// src/styles.scss, the main stylesheet

// Global variables like colors, spacings, etc...
@import "../node_modules/@density/ui/variables/colors.json";
@import "../node_modules/@density/ui/variables/spacing.json";
// (etc...)

// Here's an example component - a navbar. See how variables are required first for the component
// then the scss for the component which uses those variables is brought in.
@import "../node_modules/@density/ui-navbar/variables.json";
@import "../node_modules/@density/ui-navbar/dist/sass";

```
