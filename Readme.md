
# dotenv-parse-variables

[![Slack Status][slack-image]][slack-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Code Coverage][codecoverage-image]][codecoverage-url]
[![Standard JS Style][standard-image]][standard-url]
[![MIT License][license-image]][license-url]

> Parse dotenv files for `Boolean`, `Array`, and `Number` variable types, built for [CrocodileJS][crocodile-url].


## Index

* [Example](#example)
* [Install](#install)
* [Usage](#usage)
* [License](#license)


## Example

Imagine you have a configuration file at `.env` with the following:

```bash
FOO=bar
BAZ=2
BEEP=false
BOOP=some,thing,that,goes,wow
# note how we use an asterisk here to turn off the parsing for this variable
BLEEP=false*
# note how we use an asterisk in the array to turn off parsing for an array key value
PING=ping,true*,2,100
# note a string between bacticks won't be parsed
PONG=`some,thing,that,goes,wow`
```

After using this plugin, the environment variables are parsed to their proper types.

To test it out, simply log the returned object in your console:

```js
console.log(env);
```

And you'll see that it outputs the properly parsed variable types:

```js
{
  // String
  FOO: 'bar',
  // Number
  BAZ: 2,
  // Boolean
  BEEP: false,
  // Array
  BOOP: [ 'some', 'thing', 'that', 'goes', 'wow' ],
  // NOTE: this was not parsed due to the * asterisk override above
  BLEEP: 'false',
  // NOTE: only the `true*` above was opted out through the use of an asterisk
  PING: [ 'ping', 'true', 2, 100 ],
  // NOTE: this was not parsed because the string was between bacticks
  PONG: 'some,thing,that,goes,wow'
}
```

If your configuration line ends in `*` it will not be parsed by this package, which allows you to keep values as the `String` variable type if needed. Also when you encapsulate a value between bacticks e.g. \`value\`, the value won't be parsed and it will return as a `String` variable. This can be used in situations where you for example have a ',' inside your string and it should not be parsed as an array.

## Install

```bash
npm install --save dotenv-parse-variables
```


## Usage

This package works just fine with [dotenv][dotenv], however we also recommend to use [dotenv-extended][dotenv-extended] and [dotenv-expand][dotenv-expand] as we do in [CrocodileJS][crocodile-url].

> Example with `dotenv`:

```js
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenv.config({})
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

console.log(env);
```

> Example with `dotenv` in typescript:

```ts
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

// Because the .env variables don't exist on the `dotenv.DotenvConfigOutput` type you'll receive an error of
// `Property '...' does not exist on type 'DotenvConfigOutput'`. To get around this you can define env as
// an `any` type.
let env: any = dotenv.config({})

if (env.error) throw env.error;

// Note that if you do not assure that parsed via a truthy or `env.parsed !== undefined`
// the typescript compiler will throw an error of:
// `Type 'undefined' is not assignable to type 'Record<string, string>'`
if(env.parsed){
  env = dotenvParseVariables(env.parsed);
}

console.log(env);
```

> Example with `dotenv-extended` (which supports a well-defined `.env` file) and `dotenv-expand` (which supports variable interpolation):

```js
const dotenvExtended = require('dotenv-extended');
const dotenvMustache = require('dotenv-mustache');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenvExtended.load({
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true
});
env = dotenvMustache(env);
env = dotenvParseVariables(env);

console.log(env);
```

If you don't want to use this package to parse variable types, you could also use [getenv][getenv] (but it requires more work).


## License

[MIT][license-url]


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[npm-image]: https://img.shields.io/npm/v/dotenv-parse-variables.svg
[npm-url]: https://npmjs.org/package/dotenv-parse-variables
[crocodile-url]: https://crocodilejs.com
[standard-image]: https://img.shields.io/badge/code%20style-standard%2Bes7-brightgreen.svg
[standard-url]: https://github.com/crocodilejs/eslint-config-crocodile
[slack-image]: https://img.shields.io/badge/chat-join%20slack-brightgreen
[slack-url]: https://join.slack.com/t/ladjs/shared_invite/zt-fqei6z11-Bq2trhwHQxVc5x~ifiZG0g
[dotenv]: https://github.com/motdotla/dotenv
[dotenv-expand]: https://github.com/motdotla/dotenv-expand
[dotenv-extended]: https://github.com/keithmorris/node-dotenv-extended
[getenv]: https://github.com/ctavan/node-getenv
[build-image]: https://semaphoreci.com/api/v1/niftylettuce/dotenv-parse-variables/branches/master/shields_badge.svg
[build-url]: https://semaphoreci.com/niftylettuce/dotenv-parse-variables
[codecoverage-image]: https://codecov.io/gh/niftylettuce/dotenv-parse-variables/branch/master/graph/badge.svg
[codecoverage-url]: https://codecov.io/gh/niftylettuce/dotenv-parse-variables
