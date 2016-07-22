import React, { PropTypes, Component } from 'react';
import style from './Query.css';

export default class Query extends Component {
  render() {
    const { value, onChange } = this.props;

    return (
      <div className={style.root}>
        <input
          className={style.search}
          type='text'
          autoFocus
          placeholder={'Query'}
          onChange={e => onChange(e.target.value)}
          value={value} />
      </div>
    )
  }
};

Query.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
