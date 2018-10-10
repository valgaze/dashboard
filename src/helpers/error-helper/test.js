import assert from 'assert';
import errorHelper from './index';

describe('error-helper', () => {
  it('should by default return undefined if nothing is returned from try', async () => {
    let caughtError = false;
    const output = await errorHelper({
      try: () => { /* nothing */ },
    });

    assert.equal(output, undefined);
  });
  it('should work with try+catch', async () => {
    let caughtError = false;
    const output = await errorHelper({
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
  it('should work with try+else', async () => {
    let elseHit = false;
    const output = await errorHelper({
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
  it('should work with try+catch+finally', async () => {
    let caughtError = false, finallyHit = false;
    const output = await errorHelper({
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
  it('should work with try+catch+else', async () => {
    let caughtError = false, elseHit = false;
    const output = await errorHelper({
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
  it('should not swallow errors in the catch block', async () => {
    let errorMessage = null;
    try {
      await errorHelper({
        try: () => {
          throw new Error('First!');
        },
        catch: error => {
          throw new Error('Second!');
        },
        else: () => {
          elseHit = true;
        },
      });
    } catch (err) {
      errorMessage = err.message;
    }

    assert.equal(errorMessage, 'Second!');
  });
  it('should return data that is returned from catch if an error is thrown in try', async () => {
    const output = await errorHelper({
      try: () => {
        throw new Error('Throw an error!');
        return 'IN TRY';
      },
      catch: error => {
        return 'IN ERROR';
      },
    });

    assert.equal(output, 'IN ERROR');
  });
  it('should return data that is returned from else', async () => {
    const output = await errorHelper({
      try: () => {
        return 'IN TRY';
      },
      else: () => {
        return 'IN ELSE';
      },
    });

    assert.equal(output, 'IN ELSE');
  });
});

