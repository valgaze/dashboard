import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Appbar from 'dashboard/components/Appbar'
import Sidebar from 'dashboard/components/Sidebar'

function Spaces({spaces}) {
  return (
    <div>
      <Appbar />
      <div className="content-inner">
        <Sidebar />
        <div className="content-panel">
          <div className="tokens-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-0">
                <h1>Spaces</h1>
                {spaces ? null : "Loading..."}
                <table className="table data-table">
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>ID</td>
                      <td>Current Count</td>
                    </tr>
                  </thead>
                  <tbody>
                    {spaces && spaces.map(function(space, i) {
                      return (
                        <tr key={space.id}>
                          <td><Link to={`/spaces/${space.id}`} className="">{space.name}</Link></td>
                          <td>{space.id}</td>
                          <td>{space.current_count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Spaces);