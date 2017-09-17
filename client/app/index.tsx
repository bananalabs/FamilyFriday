/**
 * index.tsx
 *
 * This is the entry file for the application
 */

// tslint:disable-next-line
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <App/>
    </div>
  </BrowserRouter>
), document.getElementById('app'));
