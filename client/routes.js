import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Search from './containers/Search';
import SnapDetail from './containers/SnapDetail';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Search} />
    <Route path="/snap/:id/:series/:arch/" component={SnapDetail} />
  </Route>
);
