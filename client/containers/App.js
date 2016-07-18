import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectQuery, fetchSnapsIfNeeded, invalidateQuery } from '../actions';
import Snaps from '../components/Snaps'


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
    const { selectedQuery, snaps, isFetching, lastUpdated } = this.props;
    const isEmpty = (snaps.length === 0);

    console.log(snaps);

    return (
      <div>
      {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
        <Snaps snaps={snaps} />
        </div>
      }
      </div>
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
