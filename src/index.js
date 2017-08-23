
import Debug from 'debug';

const debug = new Debug('dotenv-parse-variables');

export default (env) => {

  Object.keys(env).forEach(key => {
    debug(`key "${key}" before type was ${typeof env[key]}`);
    process.env[key] = env[key] = parseKey(env[key], key);
    debug(`key "${key}" after type was ${typeof env[key]}`);
  });

  return env;

};

function parseKey(value, key) {

  debug(`parsing key ${key} with value ${value}`);

  // if the value is wrapped in double quotes e.g. (""value"") then just return its value
  if (value.toString().startsWith('""') && value.toString().endsWith('""') && value.toString().length >= 4) {
    debug(`key ${key} is wrapped in double quotes and will be ignored from parsing`);
    return value.toString().substring(2, value.toString().length - 2);
  }

  // if the value ends in an asterisk then just return its value
  if (value.toString().lastIndexOf('*') === value.toString().length - 1
    && value.toString().indexOf(',') === -1) {
    debug(`key ${key} ended in * and will be ignored from parsing`);
    return value.toString().substring(0, value.toString().length - 1);
  }

  // Boolean
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
    debug(`key ${key} parsed as a Boolean`);
    return value === 'true';
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
