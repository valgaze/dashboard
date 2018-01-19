import assert from 'assert';
import generateResetTimeChoices from './index';

import mockdate from 'mockdate';
import moment from 'moment';

describe('generate-reset-time-choices', function() {
  beforeEach(() => mockdate.reset());

  it('should work', function() {
    // A time of the year without daylight savings on the US east coast
    mockdate.set(moment('2017-01-01T00:00:00'));

    assert.deepEqual(
      generateResetTimeChoices(),
      [
        {display: "12:00 am", value: "00:00"},
        {display: "1:00 am",  value: "01:00"},
        {display: "2:00 am",  value: "02:00"},
        {display: "3:00 am",  value: "03:00"},
        {display: "4:00 am",  value: "04:00"},
        {display: "5:00 am",  value: "05:00"},
        {display: "6:00 am",  value: "06:00"},
        {display: "7:00 am",  value: "07:00"},
        {display: "8:00 am",  value: "08:00"},
        {display: "9:00 am",  value: "09:00"},
        {display: "10:00 am", value: "10:00"},
        {display: "11:00 am", value: "11:00"},
        {display: "12:00 pm", value: "12:00"},
        {display: "1:00 pm",  value: "13:00"},
        {display: "2:00 pm",  value: "14:00"},
        {display: "3:00 pm",  value: "15:00"},
        {display: "4:00 pm",  value: "16:00"},
        {display: "5:00 pm",  value: "17:00"},
        {display: "6:00 pm",  value: "18:00"},
        {display: "7:00 pm",  value: "19:00"},
        {display: "8:00 pm",  value: "20:00"},
        {display: "9:00 pm",  value: "21:00"},
        {display: "10:00 pm", value: "22:00"},
        {display: "11:00 pm", value: "23:00"},
      ]
    );
  });
});

