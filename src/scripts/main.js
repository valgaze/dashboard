import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';

import App from 'dashboard/App'
import store from 'dashboard/store';
import "whatwg-fetch"

ReactDOM.render(
    <Provider store={store}>
    	<App />
    </Provider>,
    document.getElementById('react-mount')
)
