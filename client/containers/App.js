import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectQuery, fetchSnapsIfNeeded, invalidateQuery } from '../actions';


class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, selectedQuery } = this.props
    dispatch(fetchSnapsIfNeeded(selectedQuery))
  }

  componentWillReceiveProps() {
  }

  render() {
    return (
      <div>Hello World!</div>
    )
  }
};

App.propTypes = {
  selectedQuery: PropTypes.string.isRequired,
  snaps: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedQuery, snapsByQuery} = state;
  const {
      isFetching,
      lastUpdated,
      items: snaps
    } = snapsByQuery[selectedQuery] || {
        isFetching: true,
        items: []
      }

  return {
      selectedQuery,
      snaps,
      isFetching,
      lastUpdated
    }
}

export default connect(mapStateToProps)(App)
