import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import classNames from 'classNames';
import {
  selectArch,
  selectQuery,
  fetchQuerySnapsIfNeeded } from '../actions';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import ArchPicker from '../components/Arch';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleArchChange = this.handleArchChange.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedQuery, selectedArch } = this.props
    dispatch(fetchQuerySnapsIfNeeded(selectedQuery, selectedArch))
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.selectedQuery !== this.props.selectedQuery) ||
        (nextProps.selectedArch !== this.props.selectedArch)
    ) {
      const { dispatch, selectedQuery, selectedArch } = nextProps
      dispatch(fetchQuerySnapsIfNeeded(selectedQuery, selectedArch))
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

    return (
      <div className={'b-book'}>
        <div className={'b-book__summary'}>
          <div className={'b-book__toc'}>
            <Query value={selectedQuery} onChange={this.handleChange} />
            <ArchPicker
              value={selectedArch}
              onChange={this.handleArchChange}
              options={['all', 'armhf', 'i386', 'amd64']} />
            <Snaps snaps={snaps} onClick={this.handleClick}/>
          </div>
        </div>
        <div className={'b-book__body'}>
          <div className={'b-book__inner'}>
            <div className={'b-page'}>
              <div className={'b-page__inner'}>
                {this.props.children}
              </div>
            </div>
          </div>
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
