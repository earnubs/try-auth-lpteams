import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import byteSize from 'byte-size';

export default class Snap extends Component {

  render() {
    const { snap } = this.props;

    if (snap && snap.snap_id) {
      return (
        <div className={'b-snap b-snap_detail'}>
          <p>{snap.description}</p>
          <p>{snap.license}</p>
          <p>Published {moment(snap.date_published).format('MMMM Do YYYY, h:mm:ss a')} ({moment(snap.date_published).fromNow()})</p>
          <p><a href={snap.support_url}>{snap.title} support URL</a></p>

          <div className={'b-snap__revision b-snap__revision_large'}>#{snap.revision}  | {snap.version}</div>
          <p>{byteSize(snap.binary_filesize, { units: 'iec' })}</p>
          <p>Last updated {moment(snap.last_updated).format('MMMM Do YYYY, h:mm:ss a')} ({moment(snap.last_updated).fromNow()})</p>
          <p>Anon Download URL: <a href={snap.anon_download_url}>ilink</a></p>
          <p>Channels: {snap.channels.join(', ')}</p>
          <p>Plugs: {snap.plugs.join(', ')}</p>
          <pre><code>{JSON.stringify(snap)}</code></pre>
        </div>
      );
    } else {
      return (<div>{'No revision under this configuration'}</div>);
    }

  }
}

Snap.propTypes = {
  snap: PropTypes.object
};
