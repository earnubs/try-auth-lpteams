import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import classNames from 'classNames';
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

class App extends Component {
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
    let found;

    if (!isEmpty) {
      found = <div>Found {snaps.length || 0} {pluralize('snap', snaps.length)}</div>
    }

    return (
      <div className={'b-book'}>
        <div className={'b-book__summary'}>
          <div className={'b-book__toc'}>
            <Query value={selectedQuery} onChange={this.handleChange} />
            <div className={'b-pickers'}>
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
                    options={['all', 'armhf', 'i386', 'amd64']} />
                </div>
                <div className={'u_1_3'}>
                  <ConfinementPicker
                    value={selectedConfinement}
                    onChange={this.handleConfinementChange}
                    options={['strict', 'devmode']} />
                </div>
              </div>
              <div className="b-pickers__result">{found}</div>
            </div>
            <Snaps snaps={snaps} channel={selectedChannel} arch={selectedArch} onClick={this.handleClick}/>
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

export default connect(mapStateToProps)(App)
