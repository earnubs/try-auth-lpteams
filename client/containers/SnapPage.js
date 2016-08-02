import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchSnapIfNeeded,
  selectChannel,
  selectConfinement,
  selectSnapId
} from '../actions';
import ArchPicker from '../components/Arch';
import Snap from '../components/Snap.js';
import ChannelPicker from '../components/Channel';
import ConfinementPicker from '../components/Confinement';
import { CHANNEL_OPTIONS, CONFINEMENT_OPTIONS } from '../config';

class SnapPage extends Component {
  constructor(props) {
    super(props);
    this.handleChannelChange = this.handleChannelChange.bind(this);
    this.handleConfinementChange = this.handleConfinementChange.bind(this);
  }

  componentDidMount() {
    const {
      dispatch,
      params,
      selectedChannel,
      selectedConfinement
    } = this.props;
    const {
      id,
      arch,
    } = params;
    dispatch(fetchSnapIfNeeded(id, arch, selectedChannel, selectedConfinement));
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      params,
      selectedChannel,
      selectedConfinement
    } = this.props;
    if (
      nextProps.params.id !== params.id ||
      nextProps.params.arch !== params.arch ||
      nextProps.selectedChannel !== selectedChannel ||
      nextProps.selectedConfinement !== selectedConfinement
    ) {
      const {
        selectedChannel,
        selectedConfinement
      } = nextProps;
      const {
        id,
        arch
      } = nextProps.params;

      dispatch(fetchSnapIfNeeded(
        id,
        arch,
        selectedChannel,
        selectedConfinement));
    }
  }

  handleChannelChange(next) {
    this.props.dispatch(selectChannel(next))
  }

  handleConfinementChange(next) {
    this.props.dispatch(selectConfinement(next))
  }

  render() {
    // and series too
    const {
      snap,
      selectedArch,
      selectedChannel,
      selectedConfinement
    } = this.props;

    let title;

    if (snap) {
      title = (
        <div>
          <div className="b-heading">{snap.alias} {snap.version} {snap.architecture.join(', ')}</div>
        </div>
      )
    }

    return (
    <div className="b-snappage">
      <div className={'b-control__title'}>
        {title}
      </div>
        <div className={'b-control'}>
          <div className={'b-control__box'}>
            <div className={'b-control__switch-box'}>
              <div className={'grid'}>
                <div className={'u_1_2'}>
                  <ChannelPicker
                    value={selectedChannel}
                    onChange={this.handleChannelChange}
                    options={ CHANNEL_OPTIONS } />
                </div>
                <div className={'u_1_2'}>
                  <ConfinementPicker
                    value={selectedConfinement}
                    onChange={this.handleConfinementChange}
                    options={ CONFINEMENT_OPTIONS } />
                </div>
              </div>
            </div>
          </div>
        </div>
        {snap ? <Snap snap={snap} /> : <div>Accessing…</div>}
      </div>)

  }
};

function mapStateToProps(state, ownProps) {
  const {
    snapById,
    selectedChannel,
    selectedConfinement
  } = state;

  const {
    isFetching,
    lastUpdated,
    snap
  } = snapById[ownProps.params.id] || {
    isFetching: true
  }

  return {
    snap,
    isFetching,
    lastUpdated,
    selectedChannel,
    selectedConfinement
  }
}

export default connect(mapStateToProps)(SnapPage);
