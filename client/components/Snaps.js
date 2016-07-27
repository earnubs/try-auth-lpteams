import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class Snaps extends Component {
  render() {
    const { snaps, channel, arch, confinement } = this.props;
    return (
      <div>
        {snaps.map((snap, i) =>
          <Link to={`/snap/16/${channel}/${snap.snap_id}/${arch}/${confinement}`} key={i} className={'b-snap'}>
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
