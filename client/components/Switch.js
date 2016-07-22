import React, { PropTypes, Component } from 'react';
import style from './Switch.css';

export default class Switch extends Component {
  render() {
    const { value, onChange, name, checked } = this.props;

    return (
      <div className={style.root}>
        <input
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={e => onChange(e.target.value)}
          id={'id_' + value} />
        <label className={style.label} htmlFor={'id_' + value}>{value}</label>
      </div>
    )}
};

Switch.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
