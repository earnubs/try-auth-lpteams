import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchSnapIfNeeded,
  selectChannel,
  selectConfinement
} from '../actions';
import Snap from '../components/Snap.js';
import ChannelPicker from '../components/Channel';
import ConfinementPicker from '../components/Confinement';
import { CHANNEL_OPTIONS, CONFINEMENT_OPTIONS } from '../config';

class SnapDetail extends Component {
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
      series,
    } = params;
    dispatch(fetchSnapIfNeeded(id, series, arch, selectedChannel, selectedConfinement));
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
      nextProps.params.series !== params.series ||
      nextProps.selectedChannel !== selectedChannel ||
      nextProps.selectedConfinement !== selectedConfinement
    ) {
      const {
        selectedChannel,
        selectedConfinement
      } = nextProps;
      const {
        id,
        arch,
        series
      } = nextProps.params;

      dispatch(fetchSnapIfNeeded(
        id,
        series,
        arch,
        selectedChannel,
        selectedConfinement));
    }
  }

  handleChannelChange(next) {
    this.props.dispatch(selectChannel(next));
  }

  handleConfinementChange(next) {
    this.props.dispatch(selectConfinement(next));
  }

  render() {
    // and series too
    const {
      snap,
      params,
      selectedChannel,
      selectedConfinement
    } = this.props;

    return (
      <div className={'b-package-data'}>
        <div className={'b-package-data__wrap'}>
          <div className={'b-package-data__title'}>
            <div className={'b-package-data__title_headline'}>{params.id}</div>
            Series {params.series}, {params.arch}
          </div>
        </div>
        <div className={'b-filter'}>
          <div className={'b-filter__wrap'}>
            <div className={'grid'}>
              <div className={'u_1_4'}>
                <ChannelPicker
                  value={selectedChannel}
                  onChange={this.handleChannelChange}
                  options={ CHANNEL_OPTIONS } />
              </div>
              <div className={'u_1_4'}>
                <ConfinementPicker
                  value={selectedConfinement}
                  onChange={this.handleConfinementChange}
                  options={ CONFINEMENT_OPTIONS } />
              </div>
            </div>
          </div>
        </div>
        {snap ? <Snap snap={snap} /> : <div>Accessing…</div>}
      </div>
    );
  }
}

SnapDetail.propTypes = {
  dispatch: PropTypes.func,
  snap: PropTypes.object,
  selectedChannel: PropTypes.string,
  selectedConfinement: PropTypes.string,
  params: PropTypes.object
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
  };

  return {
    snap,
    isFetching,
    lastUpdated,
    selectedChannel,
    selectedConfinement
  };
}

export default connect(mapStateToProps)(SnapDetail);
