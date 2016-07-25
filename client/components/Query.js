import React, { PropTypes, Component } from 'react';

export default class Query extends Component {
  render() {
    const { value, onChange } = this.props;

    return (
      <div className={'b-snap-query'}>
        <input
          className={'b-snap-query__input'}
          type='text'
          autoFocus
          placeholder={'Search for snaps'}
          onChange={e => onChange(e.target.value)}
          value={value} />
      </div>
    )
  }
};

Query.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
