import React, { PropTypes, Component } from 'react';

export default class Query extends Component {

  handleKeyDown(keyCode, value) {
    if (keyCode == 13) {
      this.props.onChange(value);
    }
  }

  render() {
    const { value, onChange } = this.props;


    return (
      <div className={'b-query'}>
        <input
          className={'b-query__input'}
          type='text'
          autoFocus
          placeholder={'Search for snaps'}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => this.handleKeyDown(e.which, e.target.value)}
          value={value} />
      </div>
    )
  }
};

Query.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
