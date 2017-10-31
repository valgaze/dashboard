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

We also have forked a couple open source projects and added density-specific changes - a few are `node-sass-json-importer` and `react-dates`.
