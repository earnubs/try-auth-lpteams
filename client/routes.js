import React from 'react';
import { Route } from 'react-router';
import App from './containers/App';
import SnapPage from './containers/SnapPage';

export default (
  <Route path="/" component={App}>
    <Route path="/snap/:id" component={SnapPage} />
  </Route>
)
