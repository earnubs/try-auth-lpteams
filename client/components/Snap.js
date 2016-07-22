import React, { PropTypes, Component } from 'react';
//import style from './Snap.css';

export default class Snap extends Component {
  render() {
    const { snap } = this.props;
    let html;

    html = snap ?  <div>{snap.name}</div> :
      <div></div>;

    return html;
  }
}

Snap.propTypes = {
  snap: PropTypes.object
}
