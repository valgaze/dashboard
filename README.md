<img src="https://densityco.github.io/assets/images/dashboard-logo.4031835b.svg" height="50" /> <br />

[![CircleCI](https://circleci.com/gh/DensityCo/web-dashboard.svg?style=shield&circle-token=1b5ece9522df300da10bcedd91a24b6f066b9049)](https://circleci.com/gh/DensityCo/web-dashboard)
[![Dependency
Status](https://david-dm.org/densityco/nicss.svg)](https://david-dm.org/densityco/web-dashboard)
![License](https://img.shields.io/badge/License-MIT-green.svg)

The Density Dashboard is an interface for visualizing real time and historical count data of spaces. 

Density's main product is our API. While it already has [excellent documentation](http://docs.density.io), we're open sourcing our Dashboard to help document how we're using the API and provide usage patterns that we're confident in around Density data. We hope that this project will help guide developers into integrating Density into their own systems.

The Dashboard depends on a couple of other in-house built dependencies:
- [`@density/charts`](https://github.com/densityco/charts) - an open-source library of visualizations and diagrams used by the Dashboard as well as other internal Density systems. [Here's a preview.](https://densityco.github.io/charts/master/)
- [`@density/ui`](https://github.com/densityco/ui) - an open-source library of react-based ui components with html fallbacks. This is the ui toolkit we use throughout most of our Density tools. [Here's a preview.](https://densityco.github.io/ui/master/)
- [`@density/client`](https://github.com/densityco/client-js) - A javascript-based api client built using [clientele](https://github.com/DensityCo/clientele), an api client generator. This allows us to more clearly express the intent of an api call by using a syntax such as `api.spaces.get({id: 'spc_XXX'})` instead of a long ajax call.
- [`@density/conduit`](https://github.com/densityco/conduit) - A redux-based micro router for react applications.

We also have forked a couple open source npm packages and added density-specific changes - a few are `node-sass-json-importer` and `react-dates`.

## Getting Started
This project uses `create-react-app` to build the frontend code, and `yarn` to manage dependencies.
Make sure you've installed yarn with `npm i -g yarn` prior to trying out this project in
development.
```sh
# Download code
git clone git@github.com:densityco/dashboard.git
cd dashboard/

# Install dependencies
yarn

# Start it up!
yarn start

# Run the tests
yarn test
```

### Environment variables
None of these variables are required. They enable optional features that are useful in production.
- `REACT_APP_GA_TRACKING_CODE`: Optional google analytics tracking code for tracking metrics.
- `REACT_APP_MIXPANEL_TOKEN`: Optional mixpanel token for tracking user interactions.
- `REACT_APP_ENVIRONMENT`: Optional parameter to set which set of APIs to use (production vs staging). Used by CircleCi and in `src/index.js`.

## How would I add `<insert feature here>`?

### Adding a new page
In order to add a new page, create one of each of these:

- Create the new page with the `yarn make-component`
  [utility](https://github.com/DensityCo/dashboard/tree/trunk/utilities):
```sh
dashboard/ $ yarn make-component
yarn make-component v0.27.5
$ ./utilities/make-component
Let's make a new component.
Enter the name of your component, in dash-case: hello-world
* Copying template to components/hello-world...
* Replacing placeholders with variations of hello-world...
* Adding styles to central stylesheet...
You have a new component in src/components/hello-world:
* src/components/hello-world/index.js contains your component code.
* src/components/hello-world/_styles.scss contains your component styles.
* Press enter to open the documentation in your $EDITOR...
* Done.
dashboard/ $
```

- A new [route transition
  action](https://github.com/DensityCo/dashboard/tree/trunk/src/actions#route-transition-actions)
  which will be dispatched when the user navigates to the route. This conventionally should be a
  file in the `src/actions/route-transition` directory that looks something like this:
```javascript
export const ROUTE_TRANSITION_HELLO_WORLD = 'ROUTE_TRANSITION_HELLO_WORLD';

export default function routeTransitionHelloWorld(param) {
  return async dispatch => {
    // To start with, dispatch the route transition action.
    dispatch({ type: ROUTE_TRANSITION_HELLO_WORLD });

    // Then, perform any other asynchronous data fetching, calculation, or anything else you need in
    order to properly render the page. Once complete, dispatch this data in actions to cause a
    reducer to update (which will then cause your component to re-render.)
  }
}
```

- A new entry in the [active-page
  reducer](https://github.com/DensityCo/dashboard/blob/trunk/src/reducers/active-page/index.js).
  This reducer should react to the `ROUTE_TRANSITION_*` action and update its state to reflect the
  currently active page.
```
import { ROUTE_TRANSITION_HELLO_WORLD } from '../../actions/route-transitions/hello-world';

/* ... */

export default function activePage(state=initialState, action) {
  switch (action.type) {
  /* ... */
  case ROUTE_TRANSITION_HELLO_WORLD: /* track when the user navigates to the hello world page */
    return 'HELLO_WORLD';
  /* ... */
  }
}
```

- Add a new entry to the `ActivePage` component in
  [src/components/app/index.js](https://github.com/DensityCo/dashboard/blob/trunk/src/components/app/index.js)
  that maps the value set in the previous step (`"HELLO_WORLD"`) to the component to render for that
  page.
```javascript
import HelloWorld from '../hello-world/index';
/* ... */

function ActivePage({activePage, settings}) {
  switch (activePage) {
  /* ... */
  case "HELLO_WORLD":
    return <HelloWorld />;
  /* ... */
  }
}

/* ... */
```

- A new entry for the route on the router in `src/index.js`. The callback used as the second
  argument returns an action to dispatch (conventionally, this would be the [route transition
  action](https://github.com/DensityCo/dashboard/tree/trunk/src/actions#route-transition-actions)
  you created in the previous step) :
```javascript
import routeTransitionHelloWorld from '../../actions/route-transitions/hello-world';

/* ... */

router.addRoute('hello/world/:param', param => {
  return helloWorldRouteTransition(param);
});
```

To sum it up, here's what happens step-by-step when the user navigates to `#/hello/world/foo`:
- The callback in `router.addRoute` is fired, which returns a route transition action that is
  dispatched.
- The route transition dispatches the `ROUTE_TRANSITION_HELLO_WORLD` action, which causes the
  `activePage` reducer to be updated so that it now contains the value `"HELLO_WORLD"`
- The `ActivePage` component is rerendered, which uses the `"HELLO_WORLD"` value to know to render
  the `HelloWorld` component.
- The `HelloWorld` component is rendered.

## Note on undocumented APIs
Since this dashboard does a number of tasks other than just displaying spaces, it uses a number of
internal services that aren't mentioned in our [API documentation](http://docs.density.io). While
you can use the undocumented endpoints, we only support our documented endpoints and make no
guarantees on the long term stability or existance of our undocumented software.
