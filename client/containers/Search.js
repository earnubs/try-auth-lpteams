import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
          selectedArch));
    }
  }

  handleChange(nextQuery) {
    this.props.dispatch(selectQuery(nextQuery));
  }

  handleArchChange(next) {
    this.props.dispatch(selectArch(next));
  }


  render() {
    const {
      selectedArch,
      selectedQuery,
      snaps
      } = this.props;

    let found = <div className="b-filter__result">Found {snaps.length || 0} {pluralize('snap', snaps.length)} for "{selectedQuery}" in {selectedArch}, series 16.</div>;

    return (
      <div className={'b-package-search'}>
        <div className={'b-filter'}>
          <div className={'b-filter__wrap'}>
            <div className={'grid'}>
              <div className={'u_1_2'}>
                <Query value={selectedQuery} onChange={this.handleChange} />
                {found}
              </div>
              <div className={'u_1_4'}>
                <ArchPicker
                  value={selectedArch}
                  onChange={this.handleArchChange}
                  options={ ARCH_OPTIONS }
                />
              </div>
            </div>
          </div>
        </div>
        <div className={'b-cli'}>
          <div className={'b-cli__wrap'}>
            user@{selectedArch} $ snap find {selectedQuery} --fuzzy
          </div>
        </div>
        <div className={'b-package-search__wrap'}>
          <Snaps snaps={snaps} arch={selectedArch} onClick={this.handleClick}/>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  selectedQuery: PropTypes.string.isRequired,
  selectedArch: PropTypes.string.isRequired,
  snaps: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

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
  };

  return {
    selectedQuery,
    selectedArch,
    snaps,
    isFetching,
    lastUpdated
  };
}

export default connect(mapStateToProps)(Search);
