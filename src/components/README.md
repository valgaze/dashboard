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
