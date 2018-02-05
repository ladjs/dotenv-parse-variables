
import path from 'path';
import dotenv from 'dotenv';
import dotenvParseVariables from '../../lib';
import expectedEnv from '../fixtures/env';

const TEST_PROXY = 'do.not.replace.me:9090';

describe('dotenv-parse-variables', () => {

  let env = null;

  beforeEach('load env from fixture', () => {
    env = dotenv.config({
      path: path.join(global.fixturesDir, '.env')
    });
    if (env.error) throw env.error;
  });

  it('should equal fixture already parsed', () => {
    env = dotenvParseVariables(env.parsed);
    expect(env).to.deep.equal(expectedEnv);
  });

  it('should not replace process.env keys by default', () => {
    process.env.HTTP_PROXY = TEST_PROXY;
    env = dotenvParseVariables(env.parsed);
    expect(process.env.HTTP_PROXY).to.equal(TEST_PROXY);
  });

  it('should not assign process.env keys when disabled', () => {
    process.env.FOO = 'NOT_FOO';
    process.env.BAR = 'NOT_BAR';
    env = dotenvParseVariables(env.parsed, { assignToProcessEnv: false });
    expect(process.env.FOO).to.equal('NOT_FOO');
    expect(process.env.BAR).to.equal('NOT_BAR');
  });

  it('should not replace process.env keys when disabled', () => {
    process.env.HTTP_PROXY = TEST_PROXY;
    env = dotenvParseVariables(env.parsed, { assignToProcessEnv: false, overrideProcessEnv: true });
    expect(process.env.HTTP_PROXY).to.equal(TEST_PROXY);
  });

  it('should replace process.env keys when overriden', () => {
    process.env.HTTP_PROXY = TEST_PROXY;
    env = dotenvParseVariables(env.parsed, { overrideProcessEnv: true });
    expect(process.env.HTTP_PROXY).to.not.equal(TEST_PROXY);
  });

});
