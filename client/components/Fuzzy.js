import React, { PropTypes, Component } from 'react';
import Switch from './Switch.js';

export default class Fuzzy extends Component {
  render() {
    const { checked, onChange, value } = this.props;

    return (
      <div className={'b-fuzzy-switch'}>
        <Switch
          value={value}
          type={'checkbox'}
          name={'fuzzy'}
          checked={checked}
          onChange={onChange} />
        </div>
    );
  }
}

Fuzzy.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired
};
