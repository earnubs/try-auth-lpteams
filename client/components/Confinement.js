import React, { PropTypes, Component } from 'react';
import Switch from './Switch.js';

export default class Confinement extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <div className={'b-confinement-switch'}>
        {options.map((option, i) =>
          <Switch
            key={i}
            value={option}
            type={'checkbox'}
            name={'arch'}
            checked={(value === option)}
            onChange={onChange} />
          )}
        </div>
    )
  };
};

Confinement.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
}
