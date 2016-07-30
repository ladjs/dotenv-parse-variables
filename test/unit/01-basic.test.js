
import path from 'path';
import dotenv from 'dotenv';
import dotenvParseVariables from '../../lib';
import expectedEnv from '../fixtures/env';

let env = dotenv.config({
  path: path.join(global.fixturesDir, '.env')
});

env = dotenvParseVariables(env);

describe('dotenv-parse-variables', () => {

  it('should equal fixture already parsed', () => {
    expect(env).to.deep.equal(expectedEnv);
  });

});
