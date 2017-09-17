import * as React from 'react';
import Groups from './Groups';
import AddEmployee from './AddEmployee';
import { Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <button>
        <a href='/groups'>I'm hungry. Let's eat!</a>
      </button>
      <button>
        <a href='/addEmployee'>Newhire. Come join us!</a>
      </button>
      <br/>
      <br/>
      <Route path='/groups' component={Groups}/>
      <Route path='/addEmployee' component={AddEmployee}/>
    </div>
  );
};

export default App;
