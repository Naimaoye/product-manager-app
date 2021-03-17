import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import CreatedBoard from './components/CreatedBoard/CreatedBoard';


const App=()=> {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
          </Route>
          <Route exact path="/createdboard">
          </Route>
        </Switch>  
      </BrowserRouter>
      
    </div>
  );
}

export default App;
