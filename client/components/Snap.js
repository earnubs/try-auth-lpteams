import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import byteSize from 'byte-size';

export default class Snap extends Component {

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.snap) {
      return true;
    }

    return false;
  }

  render() {
    const { snap } = this.props;

    if (snap.snap_id) {
      return (
        <div className={'b-snap b-snap_detail'}>
          <div className={'b-snap__revision b-snap__revision_large'}>#{snap.revision} {byteSize(snap.binary_filesize, { units: 'iec' })}</div>
          <p>{snap.description}</p>
          <p>Published: {moment(snap.date_published).format('MMMM Do YYYY, h:mm:ss a')} ({moment(snap.date_published).fromNow()})</p>
          <p>Last updated: {moment(snap.last_updated).format('MMMM Do YYYY, h:mm:ss a')} ({moment(snap.last_updated).fromNow()})</p>
          <p>Support URL: {snap.support_url}</p>
          <p>Licence: {snap.license}</p>
          <p>Anon Download URL: <a href={snap.anon_download_url}>ilink</a></p>
          <p>ID: {snap.snap_id}</p>
          <p>Epoch: {snap.epoch}</p>
          <p>SCAID: {snap.id}</p>
          <p>Channels: {snap.channels.join(', ')}</p>
          <p>Plugs: {snap.plugs.join(', ')}</p>
        </div>
      );
    } else {
      return <div>{'No snap'}</div>
    }

  }
}

Snap.propTypes = {
  snap: PropTypes.object
}
