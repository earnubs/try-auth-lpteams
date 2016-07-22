import React, { PropTypes, Component } from 'react';
//import style from './Snap.css';

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
      <div>
        <div>Alias: {snap.alias}</div>
        <div>Origin: {snap.origin}</div>
        <div>Licence: {snap.license}</div>
        <div>Anon Download URL: {snap.anon_download_url}</div>
        <div>Filesize: {snap.binary_filesize}</div>
        <div>Confinement: {snap.confinement}</div>
        <div>ID: {snap.snap_id}</div>
        {snap.release.map((rel, i) => <div key={i}>Release: {rel}</div>)}
        {snap.channels.map((chan, i) => <div key={i}>Channel: {chan}</div>)}
        {snap.plugs.map((plug, i) => <div key={i}>Plug: {plug}</div>)}
      </div>
    )

  }
}

Snap.propTypes = {
  snap: PropTypes.object
}
