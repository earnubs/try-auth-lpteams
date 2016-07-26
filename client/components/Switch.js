import React, { PropTypes, Component } from 'react';

export default class Switch extends Component {
  render() {
    const { value, onChange, name, type='radio', checked } = this.props;

    return (
      <div className={'b-switch'}>
        <input
          name={name}
          type={type}
          value={value}
          checked={checked}
          onChange={e => onChange(e.target.value)}
          id={'id_' + value} />
        <label htmlFor={'id_' + value}>{value}</label>
      </div>
    )}
};

Switch.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
