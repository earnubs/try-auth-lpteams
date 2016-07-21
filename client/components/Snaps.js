import React, { PropTypes, Component } from 'react';
import style from './Snaps.css';

export default class Snaps extends Component {
  render() {
    return (
      <div className={style.row}>
      {this.props.snaps.map((snap, i) =>
        <a className={style.snap} key={i} href={'/snaps/' + snap.snap_id}>
          <div className={style.hilite}>
          <span className={style.key}>#{snap.revision}</span>
          <span className={style.value}>{snap.title} <i>{'v'+snap.version}</i></span>
          </div>
          <div>
          <span className={style.key}>Summary</span>
          <span className={style.value}>{snap.summary}</span>
          </div>
          <div>
          <span className={style.key}>Publisher</span>
          <span className={style.value}>{snap.publisher}</span>
          </div>
          <div>
          <span className={style.key}>ID</span>
          <span className={style.value}>{snap.snap_id}</span>
          </div>
        </a>
      )}
      </div>
    )
  }
}

Snaps.propTypes = {
  snaps: PropTypes.array.isRequired
}
