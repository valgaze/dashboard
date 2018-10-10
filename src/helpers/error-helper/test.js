import assert from 'assert';
import errorHelper from './index';

describe('error-helper', () => {
  it('should by default return undefined if nothing is returned from try', () => {
    let caughtError = false;
    const output = errorHelper({
      try: () => { /* nothing */ },
    });

    assert.equal(output, undefined);
  });
  it('should work with try+catch', () => {
    let caughtError = false;
    const output = errorHelper({
      try: () => {
        throw new Error('SOS!');
      },
      catch: error => {
        caughtError = error;
      },
    });

    assert.equal(output, undefined);
    assert(caughtError, 'Catch block was not run!');
    assert.equal(caughtError.message, 'SOS!');
  });
  it('should work with try+else', () => {
    let elseHit = false;
    const output = errorHelper({
      try: () => {
        return 'Works!';
      },
      else: () => {
        elseHit = true;
      },
    });

    assert.equal(output, 'Works!');
    assert.equal(elseHit, true, 'Else branch was not hit');
  });
  it('should work with try+catch+finally', () => {
    let caughtError = false, finallyHit = false;
    const output = errorHelper({
      try: () => {
        throw new Error('SOS!');
      },
      catch: error => {
        caughtError = error;
      },
      finally: () => {
        finallyHit = true;
      },
    });

    assert.equal(output, undefined);
    assert.equal(finallyHit, true, 'Finally block was not run!');
    assert(caughtError, 'Catch block was not run!');
    assert.equal(caughtError.message, 'SOS!');
  });
  it('should work with try+catch+else', () => {
    let caughtError = false, elseHit = false;
    const output = errorHelper({
      try: () => {
        throw new Error('SOS!');
      },
      catch: error => {
        caughtError = error;
      },
      else: () => {
        elseHit = true;
      },
    });

    assert.equal(output, undefined);
    assert.equal(elseHit, false, 'Else block was run, even though an error was thrown!');
    assert(caughtError, 'Catch block was not run!');
    assert.equal(caughtError.message, 'SOS!');
  });
});

