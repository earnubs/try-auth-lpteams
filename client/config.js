const ARCH_OPTIONS = ['amd64', 'armhf', 'i386', 'independent'];
const CHANNEL_OPTIONS = ['stable', 'candidate', 'beta', 'edge'];
const CONFINEMENT_OPTIONS = ['strict', 'devmode'];
const FUZZY_SEARCH = 'Fuzzy search';

const DEFAULT_ARCH = 'amd64';
const DEFAULT_CHANNEL = 'stable';
const DEFAULT_CONFINEMENT = 'strict';
const DEFAULT_FUZZY = false;

const HOST = 'http://localhost:3000';
const API_SEARCH = `${HOST}/api/search`;
const API_DETAIL = `${HOST}/api/detail`;

export {
  ARCH_OPTIONS,
  API_SEARCH,
  API_DETAIL,
  CHANNEL_OPTIONS,
  CONFINEMENT_OPTIONS,
  FUZZY_SEARCH,
  DEFAULT_ARCH,
  DEFAULT_CHANNEL,
  DEFAULT_CONFINEMENT,
  DEFAULT_FUZZY
};
