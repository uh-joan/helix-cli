// The fixed exit-code contract every helix command follows (see docs/proposal.md).
export const EXIT = Object.freeze({
  OK: 0, // pass
  VIOLATIONS: 1, // violations over threshold
  USAGE: 2, // usage or config error
  ENV: 3, // environment failure (doctor)
  REGRESSION: 4, // regression against the baseline
});

export const EXIT_MEANING = Object.freeze({
  0: 'pass',
  1: 'violations over threshold',
  2: 'usage or config error',
  3: 'environment failure',
  4: 'regression against baseline',
});
