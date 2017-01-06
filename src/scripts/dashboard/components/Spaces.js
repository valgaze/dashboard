import React from 'react';
import {connect} from 'react-redux';
import {Button} from '@blueprintjs/core';
import {getCsv} from 'dashboard/actions/getCsv';
import {Link} from 'react-router';

import Appbar from 'dashboard/components/Appbar'
import Sidebar from 'dashboard/components/Sidebar'

function Spaces({spaces, pullCsv}) {
  return (
    <div>
      <Appbar />
      <div className="row">
        <Sidebar />
        <div className="col-xs-24 col-md-20">
          <div className="spaces-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-1">
                <h1>Spaces</h1>
                <div className="space-grid">
                  {spaces ? null : "Loading..."}
                  {spaces && spaces.map(function(space, i) {
                    return (
                      <div className="space-cell" key={space.id}>
                        <h3>{space.name}</h3>
                        <div className="card">
                          <div className="card-header">
                            <h5 className="card-header-title">Current Count</h5>
                            <Link to={`/spaces/${space.id}`} className="card-view-details">View Details</Link>
                          </div>
                          <div className="card-body">
                            <div className="current-count">{space.current_count}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  spaces: state.spaces.results
});

const mapDispatchToProps = dispatch => ({
  pullCsv: (spaceId="None") => evt => {
    dispatch(getCsv(spaceId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Spaces);
