import React, { PropTypes, Component } from 'react';

export default class Switch extends Component {
  render() {
    const { value, onChange, name, type='radio', checked, label } = this.props;

    return (
      <div className={'b-switch'}>
        <input
          name={name}
          type={type}
          value={value}
          checked={checked}
          onChange={e =>
            onChange((type === 'radio') ? e.target.value : e.target.checked)}
          id={'id_' + value} />
        <label htmlFor={'id_' + value}>{(label) ? label : value}</label>
      </div>
    );
  }
}

Switch.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
};
