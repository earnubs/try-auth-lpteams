import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pluralize from 'pluralize';
import {
  fetchQuerySnapsIfNeeded,
  isFuzzy,
  selectArch,
  selectQuery,
  selectSeries
} from '../actions';
import Fuzzy from '../components/Fuzzy';
import Snaps from '../components/Snaps';
import Query from '../components/Query';
import SeriesPicker from '../components/Series';
import ArchPicker from '../components/Arch';
import {
  ARCH_OPTIONS,
  SERIES_OPTIONS,
  FUZZY_SEARCH
} from '../config';

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleArchChange = this.handleArchChange.bind(this);
    this.handleSeriesChange = this.handleSeriesChange.bind(this);
    this.handleFuzzyChange = this.handleFuzzyChange.bind(this);
  }

  componentDidMount() {
    const {
      beFuzzy,
      dispatch,
      selectedArch,
      selectedQuery,
      selectedSeries
    } = this.props;

    dispatch(
      fetchQuerySnapsIfNeeded(
        selectedSeries,
        selectedArch,
        selectedQuery,
        beFuzzy
      )
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedSeries !== this.props.selectedSeries ||
      nextProps.selectedQuery !== this.props.selectedQuery ||
      nextProps.selectedArch !== this.props.selectedArch ||
      nextProps.beFuzzy !== this.props.beFuzzy
    ) {
      const {
        beFuzzy,
        dispatch,
        selectedArch,
        selectedQuery,
        selectedSeries
      } = nextProps;

      dispatch(
        fetchQuerySnapsIfNeeded(
        selectedSeries,
        selectedArch,
        selectedQuery,
        beFuzzy
        )
      );
    }
  }

  handleChange(nextQuery) {
    this.props.dispatch(selectQuery(nextQuery));
  }

  handleSeriesChange(next) {
    this.props.dispatch(selectSeries(next));
  }

  handleArchChange(next) {
    this.props.dispatch(selectArch(next));
  }

  handleFuzzyChange(next) {
    this.props.dispatch(isFuzzy(next));
  }

  render() {
    const {
      beFuzzy,
      selectedArch,
      selectedQuery,
      selectedSeries,
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
                <SeriesPicker
                  value={selectedSeries}
                  onChange={this.handleSeriesChange}
                  options={ SERIES_OPTIONS }
                />
                <Fuzzy
                  value={ FUZZY_SEARCH }
                  onChange={this.handleFuzzyChange}
                  checked={ beFuzzy }
                />
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
        <Snaps snaps={snaps} series={selectedSeries} arch={selectedArch} />
      </div>
    );
  }
}

Search.propTypes = {
  beFuzzy: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  selectedArch: PropTypes.string.isRequired,
  selectedQuery: PropTypes.string.isRequired,
  selectedSeries: PropTypes.string.isRequired,
  snaps: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  const {
    beFuzzy,
    selectedArch,
    selectedQuery,
    selectedSeries,
    snapsFromQuery
  } = state;
  const {
    isFetching,
    lastUpdated,
    items: snaps
  } = snapsFromQuery || {
    isFetching: true,
    items: []
  };

  return {
    beFuzzy,
    isFetching,
    lastUpdated,
    selectedArch,
    selectedQuery,
    selectedSeries,
    snaps
  };
}

export default connect(mapStateToProps)(Search);
