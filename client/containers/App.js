import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import classNames from 'classNames';
import {
  selectArch,
  selectQuery,
  fetchSnapsIfNeeded,
  invalidateQuery } from '../actions';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import ArchPicker from '../components/Arch';
import style from './App.css';
import grid from '../styles/grid.css';

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

    let rootStyle = classNames({
      [style.root]: true,
      [grid.root]: true
    });

    let resultsStyle = classNames({
      [style.results]: true,
      [grid.u_2_5]: true
    });

    let detailStyle = classNames({
      [style.detail]: true,
      [grid.u_3_5]: true
    });

    return (
      <div className={rootStyle}>
        <div className={resultsStyle}>
          <Query value={selectedQuery} onChange={this.handleChange} />
          <div className={grid.root}>
            <div className={grid.u_1_3}>
              <ArchPicker
                value={selectedArch}
                onChange={this.handleArchChange}
                options={['all', 'armhf', 'i386', 'amd64']} />
            </div>
            <div className={grid.u_1_3}>
            </div>
            <div className={grid.u_1_3}>
            </div>
          </div>
          <Snaps snaps={snaps} onClick={this.handleClick}/>
        </div>
        <div className={style.detail}>
          {this.props.children}
        </div>
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
