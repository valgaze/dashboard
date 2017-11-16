import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import storeFactory from '../../store';

import ImageUpload, { UPLOADED, NO_FILES, MULTIPLE_FILES } from './index';

describe('Account setup doorway detail image upload', function() {
  it('should render (smoke test)', function() {
    const noop = n => n;

    mount(<ImageUpload value={null} />);
    mount(<ImageUpload value="https://example.com/image.png" onChange={noop} />);
  });
  it('should upload a file when clicked on', function() {
    const onChange = sinon.stub();

    // Start by mounting an empty component.
    const component = mount(<ImageUpload value={null} onChange={onChange} />);

    // Normally, we'd click the file upload button, and submit a file here. But, I can't figure out
    // how to mock that :(

    // So, instead, "submit" a file like it has been uploaded.
    const FILE_ONE = Symbol('mock file one');
    component.instance().fileUploaded([FILE_ONE])

    // Confirm that the file was submitted to `onChange`
    assert.equal(onChange.callCount, 1);
    assert.deepEqual(onChange.firstCall.args, [FILE_ONE]);

    // And also confirm that the state has transitioned to `uploaded`
    assert.equal(component.state('state'), UPLOADED);
  });
  it('should clear the upload box when the user cancels a file upload', function() {
    const onChange = sinon.stub();

    // Start by mounting an empty component.
    const component = mount(<ImageUpload value={null} onChange={onChange} />);

    // Normally, we'd click the file upload button, and submit a file here. But, I can't figure out
    // how to mock that :(

    // So, instead, "submit" no files like the user clicked cancel.
    component.instance().fileUploaded([]);

    // Confirm that the empty was submitted to `onChange`
    assert.equal(onChange.callCount, 1);
    assert.deepEqual(onChange.firstCall.args, [null]);

    // And also confirm that the state has transitioned to `uploaded`
    assert.equal(component.state('state'), NO_FILES);
  });
  it('should fail to upload multiple files', function() {
    const onChange = sinon.stub();
    const onMultipleFileUpload = sinon.stub();

    // Start by mounting an empty component.
    const component = mount(<ImageUpload
      value={null}
      onChange={onChange}
      onMultipleFileUpload={onMultipleFileUpload}
    />);

    // Normally, we'd click the file upload button, and submit a file here. But, I can't figure out
    // how to mock that :(

    // So, instead, "submit" a bunch of files.
    const FILE_ONE = Symbol('file one'),
          FILE_TWO = Symbol('file two'),
          FILE_THREE = Symbol('file three');
    component.instance().fileUploaded([FILE_ONE, FILE_TWO, FILE_THREE]);

    // Confirm that `onChange` wasn't called.
    assert.equal(onChange.callCount, 0);

    // But, `onMultipleFileUpload` should have been called.
    assert.equal(onMultipleFileUpload.callCount, 1);

    // And also confirm that the state has transitioned to `multiple files`
    assert.equal(component.state('state'), MULTIPLE_FILES);
  });
});
