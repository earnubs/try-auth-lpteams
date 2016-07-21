import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  selectArch,
  selectQuery,
  fetchSnapsIfNeeded,
  invalidateQuery } from '../actions';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import ArchPicker from '../components/Arch';
import style from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
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

  handleClick(nextId) {
    //browserHistory.push(`/snap/${nextId}`);
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
      <ArchPicker
      value={selectedArch}
      onChange={this.handleArchChange}
      options={['all', 'armhf', 'i386', 'amd64']}
        />
      <Query value={selectedQuery}
      onChange={this.handleChange}
        />
      {this.props.children}
      <Snaps snaps={snaps} onClick={this.handleClick}/>
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
