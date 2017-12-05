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
