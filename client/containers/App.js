import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectQuery, fetchSnapsIfNeeded, invalidateQuery } from '../actions';
import Snaps from '../components/Snaps'
import Form from '../components/Form'


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedQuery } = this.props
    dispatch(fetchSnapsIfNeeded(selectedQuery))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedQuery !== this.props.selectedQuery) {
      const { dispatch, selectedQuery } = nextProps
      dispatch(fetchSnapsIfNeeded(selectedQuery))
    }
  }

  handleChange(nextQuery) {
    this.props.dispatch(selectQuery(nextQuery))
  }

  render() {
    const { selectedQuery, snaps, isFetching, lastUpdated } = this.props;
    const isEmpty = (snaps.length === 0);

    return (
      <div>
      <Form value={selectedQuery}
      onChange={this.handleChange}
      />
      {isEmpty
          ? (isFetching ? <div>Loading...</div> : <div>Empty.</div>)
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
