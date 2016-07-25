import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class Snaps extends Component {
  render() {
    const { snaps } = this.props;
    return (
      <div>
          {snaps.map((snap, i) =>
            <Link to={`/snap/${snap.snap_id}`} key={i} className={'b-snap'}>
              <div className={'b-snap__item b-snap__item_hilite'}>
                <span className={'b-snap__item_key'}>#{snap.revision}</span>
                <span className={'b-snap__item_value'}>{snap.title} <i>{'v'+snap.version}</i></span>
              </div>
              <div className={'b-snap__item'}>
                <span className={'b-snap__item_key'}>Summary</span>
                <span className={'b-snap__item_value'}>{snap.summary}</span>
              </div>
              <div className={'b-snap__item'}>
                <span className={'b-snap__item_key'}>Publisher</span>
                <span className={'b-snap__item_value'}>{snap.publisher}</span>
              </div>
              <div className={'b-snap__item'}>
                <span className={'b-snap__item_key'}>ID</span>
                <span className={'b-snap__item_value'}>{snap.snap_id}</span>
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
