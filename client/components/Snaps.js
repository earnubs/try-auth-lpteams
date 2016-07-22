import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import style from './Snaps.css';

export default class Snaps extends Component {
  render() {
    const { snaps, onClick } = this.props;
    return (
      <div className={style.row}>
        {snaps.map((snap, i) =>
          <Link to={`${snap.snap_id}`} key={i} className={style.snap}>
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
          </Link>
          )}
        </div>
    )
  }
}

Snaps.propTypes = {
  snaps: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
}
