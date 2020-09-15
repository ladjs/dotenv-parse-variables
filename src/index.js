const isSANB = require('is-string-and-not-blank');
const debug = require('debug')('dotenv-parse-variables');

const DEFAULT_OPTIONS = {
  assignToProcessEnv: true,
  overrideProcessEnv: false,
  ignoreFunctions: true
};

module.exports = (env, options) => {
  const envOptions = { ...DEFAULT_OPTIONS, ...(options || {}) };

  const parsed = {};

  for (const key of Object.keys(env)) {
    debug(`key "${key}" before type was ${typeof env[key]}`);
    if (env[key]) {
      if (envOptions.ignoreFunctions && typeof env[key] === 'function') {
        debug(
          `key "${key}" was a function so it is being ignored due to ignoreFunctions: true`
        );
        continue;
      }

      parsed[key] = parseKey(env[key], key);
      debug(`key "${key}" after type was ${typeof parsed[key]}`);
      if (envOptions.assignToProcessEnv === true) {
        if (envOptions.overrideProcessEnv === true) {
          process.env[key] = parsed[key] || process.env[key];
        } else {
          process.env[key] = process.env[key] || parsed[key];
        }
      }
    }
  }

  return parsed;
};

function parseKey(value, key) {
  debug(`parsing key ${key} with value ${value}`);

  // if the value is wrapped in bacticks e.g. (`value`) then just return its value
  if (
    value.toString().indexOf('`') === 0 &&
    value.toString().lastIndexOf('`') === value.toString().length - 1
  ) {
    debug(`key ${key} is wrapped in bacticks and will be ignored from parsing`);
    return value.toString().slice(1, value.toString().length - 1);
  }

  // if the value ends in an asterisk then just return its value
  if (
    value.toString().lastIndexOf('*') === value.toString().length - 1 &&
    !value.toString().includes(',')
  ) {
    debug(`key ${key} ended in * and will be ignored from parsing`);
    return value.toString().slice(0, Math.max(0, value.toString().length - 1));
  }

  // Boolean
  if (
    value.toString().toLowerCase() === 'true' ||
    value.toString().toLowerCase() === 'false'
  ) {
    debug(`key ${key} parsed as a Boolean`);
    return value.toString().toLowerCase() === 'true';
  }

  // Number
  if (isSANB(value) && !Number.isNaN(Number(value))) {
    debug(`key ${key} parsed as a Number`);
    return Number(value);
  }

  // Array
  if (
    (Array.isArray(value) || typeof value === 'string') &&
    typeof value.includes === 'function' &&
    value.includes(',')
  ) {
    debug(`key ${key} parsed as an Array`);
    return value
      .split(',')
      .filter(function (string) {
        return string !== '';
      })
      .map((string) => parseKey(string));
  }

  return value;
}
