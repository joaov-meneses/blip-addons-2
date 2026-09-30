import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { applyPolyfills, defineCustomElements } from 'blip-ds/loader';

import { App } from './App';

import '../styles/popup.css';

ReactDOM.render(<App />, document.getElementById('root'));

applyPolyfills().then(() => {
  defineCustomElements(window);
});
