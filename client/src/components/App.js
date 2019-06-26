import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Landing from './Landing';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path={['/', '/login', '/register']} component={Landing}/>
        </Switch>
      </BrowserRouter>
    </div>
  )
};

export default App;