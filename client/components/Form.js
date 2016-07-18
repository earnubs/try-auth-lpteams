import React, { PropTypes, Component } from 'react';

export default class Form extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <div>
      <input
      type='search'
      onChange={e => onChange(e.target.value)}
      value={value}
      placeholder='Snap name' />
      </div>
    )
  }
};

Form.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
