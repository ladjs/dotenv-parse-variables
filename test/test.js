const path = require('path');

const dotenv = require('dotenv');
const test = require('ava');

const dotenvParseVariables = require('..');
const expectedEnv = require('./fixtures/env');

const fixtures = path.join(__dirname, 'fixtures');
const TEST_PROXY = 'do.not.replace.me:9090';

test.beforeEach('load env from fixture', (t) => {
  t.context.env = dotenv.config({
    path: path.join(fixtures, '.env')
  });
  t.true(typeof t.context.env.error === 'undefined');
});

test('should equal fixture already parsed', (t) => {
  const env = dotenvParseVariables(t.context.env.parsed);
  t.deepEqual(env, expectedEnv);
});

test('should not replace process.env keys by default', (t) => {
  process.env.HTTP_PROXY = TEST_PROXY;
  dotenvParseVariables(t.context.env.parsed);
  t.is(process.env.HTTP_PROXY, TEST_PROXY);
});

test('should not assign process.env keys when disabled', (t) => {
  process.env.FOO = 'NOT_FOO';
  process.env.BAR = 'NOT_BAR';
  dotenvParseVariables(t.context.env.parsed, { assignToProcessEnv: false });
  t.is(process.env.FOO, 'NOT_FOO');
  t.is(process.env.BAR, 'NOT_BAR');
});

test('should not replace process.env keys when disabled', (t) => {
  process.env.HTTP_PROXY = TEST_PROXY;
  dotenvParseVariables(t.context.env.parsed, {
    assignToProcessEnv: false,
    overrideProcessEnv: true
  });
  t.is(process.env.HTTP_PROXY, TEST_PROXY);
});

test('should replace process.env keys when overridden', (t) => {
  process.env.HTTP_PROXY = t.context.env.parsed.HTTP_PROXY;
  dotenvParseVariables(
    {
      ...t.context.env.parsed,
      HTTP_PROXY: TEST_PROXY
    },
    { overrideProcessEnv: true }
  );
  t.is(process.env.HTTP_PROXY, TEST_PROXY);
});

test('should ignore and exclude functions', (t) => {
  t.deepEqual(
    dotenvParseVariables({
      foo() {
        console.log('hello');
      }
    }),
    {}
  );
});

test('should return functions', (t) => {
  const object = {
    foo() {
      console.log('hello');
    }
  };
  t.deepEqual(dotenvParseVariables(object, { ignoreFunctions: false }), object);
});
