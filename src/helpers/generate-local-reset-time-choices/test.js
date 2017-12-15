import assert from 'assert';
import generateLocalResetTimeChoices from './index';

import mockdate from 'mockdate';
import moment from 'moment';

describe('generate-local-reset-time-choices', function() {
  beforeEach(() => mockdate.reset());

  it('should work in EST', function() {
    // A time of the year without daylight savings on the US east coast
    mockdate.set(moment('2017-01-01T00:00:00'));

    assert.deepEqual(
      generateLocalResetTimeChoices('America/New_York'),
      [
        {localTime: "12:00 am", utc: "5:00"},
        {localTime: "1:00 am",  utc: "6:00"},
        {localTime: "2:00 am",  utc: "7:00"},
        {localTime: "3:00 am",  utc: "8:00"},
        {localTime: "4:00 am",  utc: "9:00"},
        {localTime: "5:00 am",  utc: "10:00"},
        {localTime: "6:00 am",  utc: "11:00"},
        {localTime: "7:00 am",  utc: "12:00"},
        {localTime: "8:00 am",  utc: "13:00"},
        {localTime: "9:00 am",  utc: "14:00"},
        {localTime: "10:00 am", utc: "15:00"},
        {localTime: "11:00 am", utc: "16:00"},
        {localTime: "12:00 pm", utc: "17:00"},
        {localTime: "1:00 pm",  utc: "18:00"},
        {localTime: "2:00 pm",  utc: "19:00"},
        {localTime: "3:00 pm",  utc: "20:00"},
        {localTime: "4:00 pm",  utc: "21:00"},
        {localTime: "5:00 pm",  utc: "22:00"},
        {localTime: "6:00 pm",  utc: "23:00"},
        {localTime: "7:00 pm",  utc: "0:00"},
        {localTime: "8:00 pm",  utc: "1:00"},
        {localTime: "9:00 pm",  utc: "2:00"},
        {localTime: "10:00 pm", utc: "3:00"},
        {localTime: "11:00 pm", utc: "4:00"},
      ]
    );
  });
  it('should work in EDT', function() {
    // A time of the year with daylight savings on the US east coast
    mockdate.set(moment('2017-08-01T00:00:00'));

    assert.deepEqual(
      generateLocalResetTimeChoices('America/New_York'),
      [
        {localTime: "12:00 am", utc: "4:00"},
        {localTime: "1:00 am",  utc: "5:00"},
        {localTime: "2:00 am",  utc: "6:00"},
        {localTime: "3:00 am",  utc: "7:00"},
        {localTime: "4:00 am",  utc: "8:00"},
        {localTime: "5:00 am",  utc: "9:00"},
        {localTime: "6:00 am",  utc: "10:00"},
        {localTime: "7:00 am",  utc: "11:00"},
        {localTime: "8:00 am",  utc: "12:00"},
        {localTime: "9:00 am",  utc: "13:00"},
        {localTime: "10:00 am", utc: "14:00"},
        {localTime: "11:00 am", utc: "15:00"},
        {localTime: "12:00 pm", utc: "16:00"},
        {localTime: "1:00 pm",  utc: "17:00"},
        {localTime: "2:00 pm",  utc: "18:00"},
        {localTime: "3:00 pm",  utc: "19:00"},
        {localTime: "4:00 pm",  utc: "20:00"},
        {localTime: "5:00 pm",  utc: "21:00"},
        {localTime: "6:00 pm",  utc: "22:00"},
        {localTime: "7:00 pm",  utc: "23:00"},
        {localTime: "8:00 pm",  utc: "0:00"},
        {localTime: "9:00 pm",  utc: "1:00"},
        {localTime: "10:00 pm", utc: "2:00"},
        {localTime: "11:00 pm", utc: "3:00"},
      ]
    );
  });

  it('should work in PST', function() {
    // A time of the year without daylight savings on the US west coast
    mockdate.set(moment('2017-01-01T00:00:00'));

    assert.deepEqual(
      generateLocalResetTimeChoices('America/Los_Angeles'),
      [
        {localTime: "12:00 am", utc: "8:00"},
        {localTime: "1:00 am",  utc: "9:00"},
        {localTime: "2:00 am",  utc: "10:00"},
        {localTime: "3:00 am",  utc: "11:00"},
        {localTime: "4:00 am",  utc: "12:00"},
        {localTime: "5:00 am",  utc: "13:00"},
        {localTime: "6:00 am",  utc: "14:00"},
        {localTime: "7:00 am",  utc: "15:00"},
        {localTime: "8:00 am",  utc: "16:00"},
        {localTime: "9:00 am",  utc: "17:00"},
        {localTime: "10:00 am", utc: "18:00"},
        {localTime: "11:00 am", utc: "19:00"},
        {localTime: "12:00 pm", utc: "20:00"},
        {localTime: "1:00 pm",  utc: "21:00"},
        {localTime: "2:00 pm",  utc: "22:00"},
        {localTime: "3:00 pm",  utc: "23:00"},
        {localTime: "4:00 pm",  utc: "0:00"},
        {localTime: "5:00 pm",  utc: "1:00"},
        {localTime: "6:00 pm",  utc: "2:00"},
        {localTime: "7:00 pm",  utc: "3:00"},
        {localTime: "8:00 pm",  utc: "4:00"},
        {localTime: "9:00 pm",  utc: "5:00"},
        {localTime: "10:00 pm", utc: "6:00"},
        {localTime: "11:00 pm", utc: "7:00"},
      ]
    );
  });
  it('should work in PDT', function() {
    // A time of the year with daylight savings on the US west coast
    mockdate.set(moment('2017-08-01T00:00:00'));

    assert.deepEqual(
      generateLocalResetTimeChoices('America/Los_Angeles'),
      [
        {localTime: "12:00 am", utc: "7:00"},
        {localTime: "1:00 am",  utc: "8:00"},
        {localTime: "2:00 am",  utc: "9:00"},
        {localTime: "3:00 am",  utc: "10:00"},
        {localTime: "4:00 am",  utc: "11:00"},
        {localTime: "5:00 am",  utc: "12:00"},
        {localTime: "6:00 am",  utc: "13:00"},
        {localTime: "7:00 am",  utc: "14:00"},
        {localTime: "8:00 am",  utc: "15:00"},
        {localTime: "9:00 am",  utc: "16:00"},
        {localTime: "10:00 am", utc: "17:00"},
        {localTime: "11:00 am", utc: "18:00"},
        {localTime: "12:00 pm", utc: "19:00"},
        {localTime: "1:00 pm",  utc: "20:00"},
        {localTime: "2:00 pm",  utc: "21:00"},
        {localTime: "3:00 pm",  utc: "22:00"},
        {localTime: "4:00 pm",  utc: "23:00"},
        {localTime: "5:00 pm",  utc: "0:00"},
        {localTime: "6:00 pm",  utc: "1:00"},
        {localTime: "7:00 pm",  utc: "2:00"},
        {localTime: "8:00 pm",  utc: "3:00"},
        {localTime: "9:00 pm",  utc: "4:00"},
        {localTime: "10:00 pm", utc: "5:00"},
        {localTime: "11:00 pm", utc: "6:00"},
      ]
    );
  });
});
