import React, { PropTypes, Component } from 'react';

export default class Snaps extends Component {
  render() {
    return (
      <ul>
      {this.props.snaps.map((snap, i) =>
        <li key={i}>{snap.title}</li>
      )}
      </ul>
    )
  }
}

Snaps.propTypes = {
  snaps: PropTypes.array.isRequired
}
