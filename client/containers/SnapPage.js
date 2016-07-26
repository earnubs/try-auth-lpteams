import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  selectSnapId,
  fetchSnapIfNeeded } from '../actions';
import Snap from '../components/Snap.js';

class SnapPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    const { id, arch, channel } = params;
    dispatch(fetchSnapIfNeeded(id, arch, channel));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props;
    const { id, arch, channel } = nextProps.params;
    if (
      (id !== params.id) ||
        (arch !== params.arch) ||
        (channel !== params.channel)
    ) {
      dispatch(fetchSnapIfNeeded(id, arch, channel));
    }
  }

  render() {
    const { snap } = this.props;

    return (snap ? <Snap snap={snap} /> : <div>Accessing…</div>)

  }
};

function mapStateToProps(state, ownProps) {
  const { snapById } = state;

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
    lastUpdated
  }
}

export default connect(mapStateToProps)(SnapPage);
