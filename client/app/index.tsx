/**
 * index.tsx
 *
 * This is the entry file for the application
 */

// tslint:disable-next-line
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import Groups from './Groups';
import AddEmployee from './AddEmployee';
import Home from './Home';

const routes =
  <Switch>
    <Route exact path='/' component={Home} />
    <Route path='/groups' component={Groups} />
    <Route path='/addEmployee' component={AddEmployee} />
  </Switch>;

ReactDOM.render((
  <BrowserRouter>
    <div>
      <App children={routes}/>
    </div>
  </BrowserRouter>
), document.getElementById('app'));
