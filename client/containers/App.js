import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  selectArch,
  selectQuery,
  fetchSnapsIfNeeded,
  invalidateQuery } from '../actions';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import Arch from '../components/Arch';
import style from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleArchChange = this.handleArchChange.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedQuery, selectedArch } = this.props
    dispatch(fetchSnapsIfNeeded(selectedQuery, selectedArch))
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.selectedQuery !== this.props.selectedQuery) ||
      (nextProps.selectedArch !== this.props.selectedArch)
    ) {
      const { dispatch, selectedQuery, selectedArch } = nextProps
      dispatch(fetchSnapsIfNeeded(selectedQuery, selectedArch))
    }
  }

  handleChange(nextQuery) {
    this.props.dispatch(selectQuery(nextQuery))
  }

  handleArchChange(nextArch) {
    this.props.dispatch(selectArch(nextArch))
  }

  render() {
    const { selectedArch, selectedQuery, snaps, isFetching, lastUpdated } = this.props;
    const isEmpty = (snaps.length === 0);

    // FIXME don't replace the entire list with loading/empty message, overlay it
    return (
      <div className={style.app}>
      <Arch
      value={selectedArch}
      onChange={this.handleArchChange}
      options={['all', 'armhf', 'i386', 'amd64']}
      />
      <Query value={selectedQuery}
      onChange={this.handleChange}
      />
      {isEmpty
          ? (isFetching ? <div className={style.loading}>Loading...</div> :
             <div className={style.empty}>Empty.</div>)
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
  const { selectedArch, selectedQuery, snapsFromQuery} = state;
  const {
    isFetching,
    lastUpdated,
    items: snaps
  } = snapsFromQuery || {
    isFetching: true,
    items: []
  }

  return {
    selectedQuery,
    selectedArch,
    snaps,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
