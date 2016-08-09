import React, { PropTypes, Component } from 'react';
import Switch from './Switch.js';

export default class Channel extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <div className={'b-channel-switch'}>
        {options.map((option, i) =>
          <Switch
            key={i}
            value={option}
            name={'channel'}
            checked={(value === option)}
            onChange={onChange} />
          )}
        </div>
    );
  }
}

Channel.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired
};
