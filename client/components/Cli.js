import React, { PropTypes, Component } from 'react';

export default class Cli extends Component {
  render() {
    const { arch, type, query } = this.props;

    const ps1 = <span className="b-cli__ps1">user@{arch} $</span>;
    const cmd = `snap ${type} ${query}`;

    const jsx = <span className="b-cli__command">{cmd}</span>;

    return (
      <div className={'b-cli'}>
        <div className={'b-cli__wrap'}>
          * Documentation <a href="http://snapcraft.io">http://snapcraft.io/</a>{"\n"}
            {ps1} {jsx}
        </div>
      </div>
    );
  }
}

Cli.propTypes = {
  arch: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  query: PropTypes.string
};
