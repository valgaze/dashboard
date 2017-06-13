import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import './built-css/styles.css';

import App from './src/components/app';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
