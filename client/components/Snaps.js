import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class Snaps extends Component {
  render() {
    const { snaps, channel, arch } = this.props;
    return (
      <div>
          {snaps.map((snap, i) =>
            <Link to={`/snap/16/${channel}/${snap.snap_id}/${arch}`} key={i} className={'b-snap'}>
              <div className={'b-snap__item b-snap__item_hilite'}>
                #{snap.revision} | {snap.title} {snap.version}
              </div>
              <div className={'b-snap__item b-snap__item_lolite'}>
                {snap.summary}
              </div>
              <div className={'b-snap__item'}>
                {snap.publisher}
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
