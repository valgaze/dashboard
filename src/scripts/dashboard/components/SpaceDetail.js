import React from 'react';
import {connect} from 'react-redux';

import Appbar from 'dashboard/components/Appbar'
import Sidebar from 'dashboard/components/Sidebar'

function SpaceDetail({space}) {
  return (
    <div>
      <Appbar />
      <div className="content-inner">
        <Sidebar />
        <div className="content-panel">
          <div className="tokens-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-0">
                <h1>{space.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  space: state.spaces.currentObj
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceDetail);