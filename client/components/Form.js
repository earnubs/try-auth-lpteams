import React, { PropTypes, Component } from 'react';
import style from './Form.css';

export default class Form extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <div className={style.root}>
      <div className={style.prompt}>$</div>
      <input
      className={style.search}
      type='text'
      autoFocus
      onChange={e => onChange(e.target.value)}
      value={value} />
      </div>
    )
  }
};

Form.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
