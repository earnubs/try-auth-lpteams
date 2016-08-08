import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class Snaps extends Component {
  render() {
    const { snaps, arch } = this.props;
    return (
      <div className={'b-package-data'}>
        {snaps.map((snap, i) =>
          <Link to={`/snap/${snap.alias}/16/${arch}/`} key={i} className={'b-package-data__link'}>
            <div className={'b-package-data__title b-package-data__title_compact'}>
              <div className={'b-package-data__title_headline'}>
                {snap.title} {snap.version}
              </div>
              <div>{snap.publisher}</div>
            </div>
            <div className={'b-package-data__item'}>{snap.summary}</div>
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
