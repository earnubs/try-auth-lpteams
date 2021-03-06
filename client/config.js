const ARCH_OPTIONS = ['amd64', 'armhf', 'i386', 'independent'];
const CHANNEL_OPTIONS = ['stable', 'candidate', 'beta', 'edge'];
const CONFINEMENT_OPTIONS = ['strict', 'devmode'];
const SERIES_OPTIONS = ['16'];
const FUZZY_SEARCH = 'Fuzzy searching';

const DEFAULT_ARCH = ARCH_OPTIONS[0];
const DEFAULT_CHANNEL = CHANNEL_OPTIONS[0];
const DEFAULT_CONFINEMENT = CONFINEMENT_OPTIONS[0];
const DEFAULT_SERIES = SERIES_OPTIONS[0];
const DEFAULT_FUZZY = true;
const DEFAULT_QUERY = '';

const API_HOST_URL = process.env.HOST_URL || `${window.location.protocol}//${window.location.host}`;
const API_SEARCH = `${API_HOST_URL}/api/search`;
const API_DETAIL = `${API_HOST_URL}/api/details`;

export {
  API_HOST_URL,
  API_DETAIL,
  API_SEARCH,
  ARCH_OPTIONS,
  CHANNEL_OPTIONS,
  CONFINEMENT_OPTIONS,
  DEFAULT_ARCH,
  DEFAULT_CHANNEL,
  DEFAULT_CONFINEMENT,
  DEFAULT_FUZZY,
  DEFAULT_QUERY,
  DEFAULT_SERIES,
  FUZZY_SEARCH,
  SERIES_OPTIONS
};
