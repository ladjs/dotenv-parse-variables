# dotenv-parse-variables

[![build status](https://travis-ci.com/niftylettuce/dotenv-parse-variables.svg)](https://travis-ci.com/niftylettuce/dotenv-parse-variables)
[![code coverage](https://img.shields.io/codecov/c/github/niftylettuce/dotenv-parse-variables.svg)](https://codecov.io/gh/niftylettuce/dotenv-parse-variables)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/niftylettuce/dotenv-parse-variables.svg)](LICENSE)

> Parse dotenv files for `Boolean`, `Array`, and `Number` variable types, built for [Lad][] and [Forward Email][fe].


## Table of Contents

* [Install](#install)
* [Example](#example)
* [Usage](#usage)
* [Options](#options)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install dotenv-parse-variables
```

[yarn][]:

```sh
yarn add dotenv-parse-variables
```


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
  // NOTE: only the "true*" above was opted out through the use of an asterisk
  PING: [ 'ping', 'true', 2, 100 ],
  // NOTE: this was not parsed because the string was between bacticks
  PONG: 'some,thing,that,goes,wow'
}
```

If your configuration line ends in `*` it will not be parsed by this package, which allows you to keep values as the `String` variable type if needed. Also when you encapsulate a value between bacticks e.g. \`value\`, the value won't be parsed and it will return as a `String` variable. This can be used in situations where you for example have a `,` inside your string and it should not be parsed as an array.


## Usage

This package works well with [dotenv][dotenv], however we also recommend to use [dotenv-extended][dotenv-extended] and [dotenv-expand][dotenv-expand] as we do in [Lad][].  You could also simply just use [Lad][] or [@ladjs/env][] specifically.

> Example with `dotenv`:

```js
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenv.config({})
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

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


## Options

A second argument can be provided to `dotenvParseVariables` with an object of options.

The defaults are listed below:

* `assignToProcessEnv` (Boolean) - defaults to `true`, whether or not to assign the parsed values to `process.env`
* `overrideProcessEnv` (Boolean) - defaults to `false`, whether or not to override existing values in `process.env`
* `ignoreFunctions` (Boolean) - defaults to `true`, whether or not to ignore functions in the parsed values returned


## Contributors

| Name           | Website                   |
| -------------- | ------------------------- |
| **Nick Baugh** | <http://niftylettuce.com> |


## License

[MIT](LICENSE) © Nick Baugh


## 

[lad]: https://lad.js.org

[fe]: https://forwardemail.net

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[dotenv]: https://github.com/motdotla/dotenv

[dotenv-expand]: https://github.com/motdotla/dotenv-expand

[dotenv-extended]: https://github.com/keithmorris/node-dotenv-extended

[getenv]: https://github.com/ctavan/node-getenv

[@ladjs/env]: https://github.com/ladjs/env
