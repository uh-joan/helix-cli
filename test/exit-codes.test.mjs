import test from 'node:test';
import assert from 'node:assert/strict';
import { EXIT, EXIT_MEANING } from '../src/exit-codes.mjs';

test('exit codes match the documented contract', () => {
  assert.equal(EXIT.OK, 0);
  assert.equal(EXIT.VIOLATIONS, 1);
  assert.equal(EXIT.USAGE, 2);
  assert.equal(EXIT.ENV, 3);
  assert.equal(EXIT.REGRESSION, 4);
});

test('every code has a human meaning', () => {
  for (const code of Object.values(EXIT)) {
    assert.equal(typeof EXIT_MEANING[code], 'string');
  }
});
