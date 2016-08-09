import React, { PropTypes, Component } from 'react';
import Switch from './Switch.js';

export default class Series extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <div className={'b-series-switch'}>
        {options.map((option, i) =>
          <Switch
            key={i}
            label={`Series ${value}`}
            value={option}
            name={'series'}
            checked={(value === option)}
            onChange={onChange} />
          )}
        </div>
    );
  }
}

Series.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired
};
