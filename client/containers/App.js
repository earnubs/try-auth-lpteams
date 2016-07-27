import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import classNames from 'classNames';
import pluralize from 'pluralize';
import {
  selectArch,
  selectQuery,
  selectChannel,
  fetchQuerySnapsIfNeeded } from '../actions';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import ArchPicker from '../components/Arch';
import ChannelPicker from '../components/Channel';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleArchChange = this.handleArchChange.bind(this);
    this.handleChannelChange = this.handleChannelChange.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedQuery, selectedArch, selectedChannel } = this.props;
    dispatch(fetchQuerySnapsIfNeeded(selectedQuery, selectedArch, selectedChannel));
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.selectedQuery !== this.props.selectedQuery) ||
        (nextProps.selectedArch !== this.props.selectedArch) ||
        (nextProps.selectedChannel !== this.props.selectedChannel)
    ) {
      const { dispatch, selectedQuery, selectedArch, selectedChannel } = nextProps
      dispatch(fetchQuerySnapsIfNeeded(selectedQuery, selectedArch, selectedChannel))
    }
  }

  handleChange(nextQuery) {
    this.props.dispatch(selectQuery(nextQuery))
  }

  handleArchChange(next) {
    this.props.dispatch(selectArch(next))
  }

  handleChannelChange(next) {
    console.log(next);
    this.props.dispatch(selectChannel(next))
  }

  render() {
    const { selectedChannel, selectedArch, selectedQuery, snaps, isFetching, lastUpdated } = this.props;
    const isEmpty = (snaps.length === 0);
    let found;

    if (!isEmpty) {
      found = <div>Found {snaps.length || 0} {pluralize('snap', snaps.length)} for query "{selectedQuery}" in series 16, channel {selectedChannel}, architecture {selectedArch}</div>
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
  const { selectedChannel, selectedArch, selectedQuery, snapsFromQuery} = state;
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
    selectedChannel,
    selectedArch,
    snaps,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
