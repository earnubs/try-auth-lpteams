import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class Snaps extends Component {
  render() {
    const { snaps, arch } = this.props;
    return (
      <div className={'b-results'}>
        {snaps.map((snap, i) =>
          <Link to={`/snap/${snap.alias}/16/${arch}/`} key={i} className={'b-snap'}>
            <div className={'b-snap__title'}>
              {snap.title} <b>{snap.version}</b> <span className={'b-snap__publisher'}>{snap.publisher}</span>
            </div>
            <div className={'b-snap__summary'}>
              {snap.summary}
            </div>
          </Link>
        )}
      </div>
    );
  }
}

Snaps.propTypes = {
  snaps: PropTypes.array.isRequired,
  arch: PropTypes.string.isRequired
};
