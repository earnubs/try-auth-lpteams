import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class Snaps extends Component {
  render() {
    const { snaps, arch } = this.props;
    return (
      <div className={'b-results'}>
        {snaps.map((snap, i) =>
          <Link to={`/snap/${snap.snap_id}/16/${arch}/`} key={i} className={'b-snap'}>
            <div className={'b-snap__item b-snap__item_hilite'}>
              <span className={'b-snap__revision'}>#{snap.revision}</span> {snap.title} {snap.version} <span className={'b-snap__publisher'}>{snap.publisher}</span>
            </div>
            <div className={'b-snap__item b-snap__item_lolite'}>
              {snap.summary}
            </div>
          </Link>
        )}
      </div>
    )
  }
}

Snaps.propTypes = {
  snaps: PropTypes.array.isRequired
}
