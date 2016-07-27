import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import pluralize from 'pluralize';
import {
  selectArch,
  selectQuery,
  selectChannel,
  selectConfinement,
  fetchQuerySnapsIfNeeded } from '../actions';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import ArchPicker from '../components/Arch';
import ChannelPicker from '../components/Channel';
import ConfinementPicker from '../components/Confinement';

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleArchChange = this.handleArchChange.bind(this);
    this.handleChannelChange = this.handleChannelChange.bind(this);
    this.handleConfinementChange = this.handleConfinementChange.bind(this);
  }

  componentDidMount() {
    const {
      dispatch,
      selectedQuery,
      selectedArch,
      selectedChannel,
      selectedConfinement
    } = this.props;
    dispatch(
      fetchQuerySnapsIfNeeded(
        selectedQuery,
        selectedArch,
        selectedChannel,
        selectedConfinement));
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.selectedQuery !== this.props.selectedQuery) ||
        (nextProps.selectedArch !== this.props.selectedArch) ||
        (nextProps.selectedChannel !== this.props.selectedChannel) ||
        (nextProps.selectedConfinement !== this.props.selectedConfinement)
    ) {
      const {
        dispatch,
        selectedQuery,
        selectedArch,
        selectedChannel,
        selectedConfinement
      } = nextProps
      dispatch(
        fetchQuerySnapsIfNeeded(
          selectedQuery,
          selectedArch,
          selectedChannel,
          selectedConfinement))
    }
  }

  handleChange(nextQuery) {
    this.props.dispatch(selectQuery(nextQuery))
  }

  handleArchChange(next) {
    this.props.dispatch(selectArch(next))
  }

  handleChannelChange(next) {
    this.props.dispatch(selectChannel(next))
  }

  handleConfinementChange(next) {
    this.props.dispatch(selectConfinement(next))
  }

  render() {
    const {
      selectedConfinement,
      selectedChannel,
      selectedArch,
      selectedQuery,
      snaps,
      isFetching,
      lastUpdated } = this.props;
    const isEmpty = (snaps.length === 0);

    let found = <div>Found <b>{snaps.length || 0}</b> {pluralize('snap', snaps.length)} for "{selectedQuery}" in series 16, {selectedChannel}, {selectedArch}, {selectedConfinement} confinement.</div>

    return (
      <div className={'b-search'}>
        <div className={'b-control'}>
          <div className={'b-control__box'}>
            <div className={'b-control__query-box'}>
              <Query value={selectedQuery} onChange={this.handleChange} />
              <div className="b-control__result">{found}</div>
            </div>
            <div className={'b-control__switch-box'}>
              <div className={'grid'}>
                <div className={'u_1_3'}>
                  <ChannelPicker
                    value={selectedChannel}
                    onChange={this.handleChannelChange}
                    options={['stable', 'candidate', 'beta', 'edge']} />
                </div>
                <div className={'u_1_3'}>
                  <ArchPicker
                    value={selectedArch}
                    onChange={this.handleArchChange}
                    options={['independent', 'armhf', 'i386', 'amd64']} />
                </div>
                <div className={'u_1_3'}>
                  <ConfinementPicker
                    value={selectedConfinement}
                    onChange={this.handleConfinementChange}
                    options={['strict', 'devmode']} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.props.children}
        <Snaps snaps={snaps} channel={selectedChannel} arch={selectedArch} confinement={selectedConfinement} onClick={this.handleClick}/>
      </div>
    )
  }
};

Search.propTypes = {
  selectedQuery: PropTypes.string.isRequired,
  snaps: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const {
    selectedConfinement,
    selectedChannel,
    selectedArch,
    selectedQuery,
    snapsFromQuery} = state;
  const {
    isFetching,
    lastUpdated,
    items: snaps
  } = snapsFromQuery || {
    isFetching: true,
    items: []
  }

  return {
    selectedConfinement,
    selectedQuery,
    selectedChannel,
    selectedArch,
    snaps,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(Search)
