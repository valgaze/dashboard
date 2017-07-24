<!--
<img src="https://cdn.rawgit.com/DensityCo/web-dashboard/master/logo.svg" height="50" /> <br />
-->

# Web Dashboard

[![CircleCI](https://circleci.com/gh/DensityCo/web-dashboard.svg?style=shield&circle-token=1b5ece9522df300da10bcedd91a24b6f066b9049)](https://circleci.com/gh/DensityCo/web-dashboard)
[![Dependency
Status](https://david-dm.org/densityco/nicss.svg)](https://david-dm.org/densityco/web-dashboard)
<!-- ![License](https://img.shields.io/badge/License-MIT-green.svg) -->


This project is react based, and uses redux for state management.

*NOTE*: most of the conventions we're using are still in flux (ha, get it, redux joke!), and it you have
contrary opinions let me know.

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

# Real time events
Real time events are sent to this service via websockets, via the
[https://github.com/DensityCo/websocket-server](websocket-server). The websocket client is mostly in
`src/helpers/websocket-event-pusher/index.js`.
