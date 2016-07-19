import React, { PropTypes, Component } from 'react';
import style from './Snaps.css';

export default class Snaps extends Component {
  render() {
    return (
      <div className={style.row}>
      {this.props.snaps.map((snap, i) =>
        <div className={style.snap} key={i}>
          <div className={style.hilite}>
          <span className={style.key}>Title</span>
          <span className={style.value}>{snap.title}</span>
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
          <span className={style.key}>Revision</span>
          <span className={style.value}>{snap.revision}</span>
          </div>
          <div>
          <span className={style.key}>Revision</span>
          <span className={style.value}>{snap.version}</span>
          </div>
          <div>
          <span className={style.key}>ID</span>
          <span className={style.value}>{snap.snap_id}</span>
          </div>
        </div>
      )}
      </div>
    )
  }
}

Snaps.propTypes = {
  snaps: PropTypes.array.isRequired
}
