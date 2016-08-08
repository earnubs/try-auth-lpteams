import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import byteSize from 'byte-size';

export default class Snap extends Component {

  render() {
    const { snap } = this.props;

    if (snap && snap.snap_id) {
      return (
        <div className={'b-package-data__wrap'}>
          <div className={'b-package-data__title'}><span className={'b-package-data__revision'}>#{snap.revision}</span> <span className={'b-package-data__version'}>{snap.version}</span> {byteSize(snap.binary_filesize, { units: 'iec' })}</div>
          <p>{snap.description}</p>
          <div className="b-package-data__item">Published <b>{moment(snap.date_published).format('MMMM Do YYYY, h:mm:ss a')}</b>, ({moment(snap.date_published).fromNow()})</div>
          <div className="b-package-data__item">
            Licensed under <b>{snap.license} licence</b>
          </div>
          <div className="b-package-data__item">Support URL&nbsp;
            <a href={snap.support_url}>{snap.support_url}</a>
          </div>
          <div className="b-package-data__item">Last Updated <b>{moment(snap.last_updated).format('MMMM Do YYYY, h:mm:ss a')}</b>, ({moment(snap.last_updated).fromNow()})</div>

          <div className={'b-package-data__item'}></div>
          <div className={'b-package-data__item'}><a href={snap.anon_download_url}>Anon. download</a></div>
          <div className={'b-package-data__item'}>Plugs: {snap.plugs.join(', ')||'–'}</div>
          <div className={'b-package-data__item'}>Slots: {snap.slots.join(', ')||'–'}</div>
          <div className="b-package-data__json">
            <pre><code>{JSON.stringify(snap, null, 2)}</code></pre>
          </div>
        </div>
      );
    } else {
      return (
        <div className={'b-package-data__wrap'}>
          {'No revision under this configuration'}
        </div>
      );
    }

  }
}

Snap.propTypes = {
  snap: PropTypes.object
};
