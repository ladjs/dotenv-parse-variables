
import Debug from 'debug';

const debug = new Debug('dotenv-parse-variables');

const DEFAULT_OPTIONS = {
  assignToProcessEnv: true,
  overrideProcessEnv: false
};

export default (env, options) => {
  const envOptions = Object.assign({}, DEFAULT_OPTIONS, options || {});

  Object.keys(env).forEach(key => {
    debug(`key "${key}" before type was ${typeof env[key]}`);
    if (env[key]) {
      env[key] = parseKey(env[key], key);
      debug(`key "${key}" after type was ${typeof env[key]}`);
      if (envOptions.assignToProcessEnv === true) {
        if (envOptions.overrideProcessEnv === true) {
          process.env[key] = env[key] || process.env[key];
        } else {
          process.env[key] = process.env[key] || env[key];
        }
      }
    }
  });

  return env;

};

function parseKey(value, key) {

  debug(`parsing key ${key} with value ${value}`);

  // if the value is wrapped in bacticks e.g. (`value`) then just return its value
  if (value.toString().indexOf('`') === 0
    && value.toString().lastIndexOf('`') === value.toString().length - 1) {
    debug(`key ${key} is wrapped in bacticks and will be ignored from parsing`);
    return value.toString().substring(1, value.toString().length - 1);
  }

  // if the value ends in an asterisk then just return its value
  if (value.toString().lastIndexOf('*') === value.toString().length - 1
    && value.toString().indexOf(',') === -1) {
    debug(`key ${key} ended in * and will be ignored from parsing`);
    return value.toString().substring(0, value.toString().length - 1);
  }

  // Boolean
  if (value.toString().toLowerCase() === 'true' || value.toString().toLowerCase() === 'false') {
    debug(`key ${key} parsed as a Boolean`);
    return value.toString().toLowerCase() === 'true';
  }

  // Number
  if (!isNaN(value)) {
    debug(`key ${key} parsed as a Number`);
    return Number(value);
  }

  // Array
  if (value.indexOf(',') !== -1) {
    debug(`key ${key} parsed as an Array`);
    return value.split(',').map(parseKey);
  }

  return value;

}
