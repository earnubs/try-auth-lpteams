import React, { PropTypes, Component } from 'react';

export default class Snaps extends Component {
  render() {
    return (
      <div>
      {this.props.snaps.map((snap, i) =>
        <div className='snap' key={i}>
          <div>Title: {snap.title}</div>
          <div>Summary: {snap.summary}</div>
          <div>Publisher: {snap.publisher}</div>
          <div>Revision: #{snap.revision}</div>
          <div>Version: {snap.version}</div>
          <div>ID: {snap.snap_id}</div>
        </div>
      )}
      </div>
    )
  }
}

Snaps.propTypes = {
  snaps: PropTypes.array.isRequired
}
