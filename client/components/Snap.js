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

    return (
      <div className={'b-snap-page'}>
        <h1>{snap.alias} {snap.version}</h1>
        <div>Name: {snap.name}</div>
        <div>Origin: {snap.origin}</div>
        <div>Support URL: {snap.support_url}</div>
        <div>Description: {snap.description}</div>
        <div>Last updated: {moment(snap.last_updated).format('MMMM Do YYYY, h:mm:ss a')} ({moment(snap.last_updated).fromNow()})</div>
        <div>Published: {moment(snap.date_published).format('MMMM Do YYYY, h:mm:ss a')} ({moment(snap.date_published).fromNow()})</div>
        <div>Alias: {snap.alias}</div>
        <div>Origin: {snap.origin}</div>
        <div>Licence: {snap.license}</div>
        <div>Anon Download URL: {snap.anon_download_url}</div>
        <div>Filesize: {byteSize(snap.binary_filesize, { units: 'iec' })}</div>
        <div>Confinement: {snap.confinement}</div>
        <div>ID: {snap.snap_id}</div>
        <div>Epoch: {snap.epoch}</div>
        <div>SCAID: {snap.id}</div>
        <div>Architectures:{' '}
          {snap.architecture.map((val, i) => <span key={i}>{val} </span>)}
        </div>
        <div>Releases: {snap.release.join(', ')}</div>
        <div>Channels: {snap.channels.join(', ')}</div>
        <div>Plugs: {snap.plugs.join(', ')}</div>
      </div>
    )

  }
}

Snap.propTypes = {
  snap: PropTypes.object
}
