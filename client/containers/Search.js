import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import pluralize from 'pluralize';
import {
  fetchQuerySnapsIfNeeded,
  selectArch,
  selectQuery
} from '../actions';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import ArchPicker from '../components/Arch';
import { ARCH_OPTIONS } from '../config';

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleArchChange = this.handleArchChange.bind(this);
  }

  componentDidMount() {
    const {
      dispatch,
      selectedQuery,
      selectedArch,
    } = this.props;
    dispatch(
      fetchQuerySnapsIfNeeded(
        selectedQuery,
        selectedArch
      ));
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedQuery !== this.props.selectedQuery ||
      nextProps.selectedArch !== this.props.selectedArch
    ) {
      const {
        dispatch,
        selectedQuery,
        selectedArch
      } = nextProps;

      dispatch(
        fetchQuerySnapsIfNeeded(
          selectedQuery,
          selectedArch))
    }
  }

  handleChange(nextQuery) {
    this.props.dispatch(selectQuery(nextQuery))
  }

  handleArchChange(next) {
    this.props.dispatch(selectArch(next))
  }


  render() {
    const {
      selectedArch,
      selectedQuery,
      snaps,
      isFetching,
      lastUpdated } = this.props;
    const isEmpty = (snaps.length === 0);

    let found = <div>Found <b>{snaps.length || 0}</b> {pluralize('snap', snaps.length)} for "{selectedQuery}" in {selectedArch}, series 16.</div>

    return (
      <div className={'b-search'}>
        <div className={'b-control'}>
          <div className={'b-control__box'}>
            <div className={'b-control__query-box'}>
              <Query value={selectedQuery} onChange={this.handleChange} />
              <div className="b-control__result">{found}</div>
            </div>
            <div className={'b-control__switch-box'}>
              <ArchPicker
                value={selectedArch}
                onChange={this.handleArchChange}
                options={ ARCH_OPTIONS }
              />
            </div>
          </div>
        </div>
        <Snaps snaps={snaps} arch={selectedArch} onClick={this.handleClick}/>
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
    selectedQuery,
    selectedArch,
    snaps,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(Search)
