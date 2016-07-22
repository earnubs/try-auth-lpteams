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
    const { dispatch, params } = this.props
    dispatch(fetchSnapIfNeeded(params.id));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      const { dispatch, params } = this.props;
      dispatch(fetchSnapIfNeeded(params.id));
    }
  }

  render() {
    const { snap, isFetching } = this.props;

    return <Snap snap={snap} className={isFetching ? 'loading' : 'ready'}/>
  }
};

function mapStateToProps(state, ownProps) {
  const { selectedSnap, snapById } = state;

  const {
    isFetching,
    lastUpdated,
    snap
  } = snapById[ownProps.params.id] || {
    isFetching: true,
    lastUpdated: null,
    snap: {}
  }

  return {
    snap,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(SnapPage);
