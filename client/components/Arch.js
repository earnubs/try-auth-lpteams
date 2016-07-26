import React, { PropTypes, Component } from 'react';
import Switch from './Switch.js';

export default class Arch extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <div className={'b-arch-switch'}>
        {options.map((option, i) =>
          <Switch
            key={i}
            value={option}
            name={'arch'}
            checked={(value === option)}
            onChange={onChange} />
          )}
        </div>
    )
  };
};

Arch.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
}
