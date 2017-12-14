# Components

Components in the project are located within the `src/components` folder and are stored as a
flat folder list. Styles and component code are stored side-by-side:

```
src/components/
├── app
│   ├── README.md
│   ├── _styles.scss
│   └── index.js
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

## Props
React components take props (represented as attributes in jsx) as arguments. A couple conventions
that have been adopted around prop names:

- Props that start with `on` contain callbacks that fire on user interaction. For example, the
  `account-setup-doorway-list` component has two props called `onCreateDoorway` and
  `onHideSuccessToast` - the first is called when the user clicks the submit button on that form and
  the other is called when the user dismisses the success toast at the top of the page. The `on`
  prefix mirrors native event handlers (such as `onClick`, `onChecked`, etc) and helps signify that
  this function will be called as a response to a user event.

- Props that start with the `initial` prefix are used to indicate that their value will only be used
  on component load, and not "updated" when the component rerenders. In react, this is often an
  antipattern, and as with all antipatterns, should be avoided. However, there's a few cases where
  this is actually what is expected - one example notable example is forms. Forms usually take in
  data, allow a user to modify it, then emit the changed data in some way that it can be sent to a
  server. Because the initial state of the form is invalid after the user has started modifying it,
  we wouldn't want the form state to change if the prop value changed, anyway. To signify that the
  prop that is stored into the state isn't "reactive" in this way, it's prefixed with `initial`. A
  few examples are [this component](https://github.com/DensityCo/dashboard/tree/master/src/components/environment-modal-update-doorway),
  [this form](https://github.com/DensityCo/dashboard/tree/master/src/components/environment-modal-update-space).
  So, yes, storing props into state is an antipattern, but only if done in such a way that it isn't
  managed properly.

## State
This project is made up of a mix of stateful and stateless components. There are a few patterns that
have been used within the state of some components that are notable:

- One common pattern is to include a single key that represents the current presentational look of
  the component. An example of this is [the login
  component](https://github.com/DensityCo/dashboard/tree/master/src/components/login). There's a key
  called `view` that can be set to a number of constants - `LOGIN` or `FORGOT_PASSWORD` - to select
  how the component should present itself. When the component wants to change how it looks, it
  updates only that key. Then, in the render function, there are a number potential presentations
  that switch on that key in the state to determine how the component should look. [Here's another
  example](https://github.com/DensityCo/dashboard/tree/master/src/components/account-setup-doorway-detail-image-upload)
  of this pattern in action. One big advantage to this pattern is that you can often make the
  assumption that if a component is rendering in a particular way, that all the data is there that
  the component expects, which can cut down on the amount of error handling or edge case logic.
