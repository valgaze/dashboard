<img src="https://densityco.github.io/assets/images/dashboard-logo.4031835b.svg" height="50" /> <br />

[![CircleCI](https://circleci.com/gh/DensityCo/web-dashboard.svg?style=shield&circle-token=1b5ece9522df300da10bcedd91a24b6f066b9049)](https://circleci.com/gh/DensityCo/web-dashboard)
[![Dependency
Status](https://david-dm.org/densityco/nicss.svg)](https://david-dm.org/densityco/web-dashboard)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Density is a modern infrastructure for counting people. The Dashboard is a tool on top of the software platform, exposing insights through live and trend data, and allowing you to manage your account and installs.

Density's core product is our API. While it is [thoroughly documented](http://docs.density.io), we're open sourcing our Dashboard as a guide to integrating our API and data into a tangible product; providing usage patterns that we're confident in.

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

## Note on undocumented APIs
Since this dashboard does a number of tasks other than just displaying spaces, it uses a number of
internal services that aren't mentioned in our [API documentation](http://docs.density.io). While
you can use the undocumented endpoints, we only support our documented endpoints and make no
guarantees on the long term stability or existance of our undocumented software.

## Core Concepts
- [**Actions**](src/actions/): [Redux actions](https://redux.js.org/basics/actions) and action creators - data payloads and functions (vanilla and thunks) that create actions.
- [**Reducers**](src/reducers/): [Redux reducers](https://redux.js.org/basics/reducers) - functions that update the state based on provided actions.
- [**Components**](src/components/): The hierarchy of modules that build the UI.
- [**Helpers**](src/helpers/): Pure, reusable functions.
- [**Utilities**](utilities/): Template-based code + directory structure generators for core concepts.

## Learning
Documentation is sprinkled throughout the project's modules, focused on usage and design patterns.

We'll be continuing to build out this documentation to aid developers interested in integrating Density into their product.

If there are any questions about implementation or design pattern, don't hesitate to reach out with an issue!
