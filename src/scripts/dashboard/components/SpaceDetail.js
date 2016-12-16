import React from 'react';
import {connect} from 'react-redux';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';
import SpaceCurrentCountCard from 'dashboard/components/SpaceCurrentCountCard';
import SpaceDetailsCard from 'dashboard/components/SpaceDetailsCard';

function SpaceDetail({
  space,
}) {
  return (
    <div>
      <Appbar />
      <div className="row">
        <Sidebar />
        <div className="col-xs-24 col-md-20">
          <div className="space-detail-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-1">
                <h1><span className="breadcrumb">Spaces /</span> {space.name}</h1>
                <div className="count-and-detail-section">
                  <div className="row">
                    <div className="col-xs-20 off-xs-2 col-md-12 off-md-0">
                      <SpaceCurrentCountCard />
                    </div>
                    <div className="col-xs-20 off-xs-2 col-md-12 off-md-0">
                      <SpaceDetailsCard />
                    </div>
                  </div>
                </div>
                <div className="doorways-section">
                  <div className="card-top-header">
                    <span className="title">Doorways</span>
                  </div>
                  <div className="card">
                    <table className="table striped">
                      <thead>
                        <tr>
                          <td>Name</td>
                          <td>ID</td>
                          <td>Sensor Status</td>
                        </tr>
                      </thead>
                      <tbody>
                        {space.doorways && space.doorways.map(function(doorway, i) {
                          return (
                            <tr key={doorway.doorway_id}>
                              <td>{doorway.name}</td>
                              <td>{doorway.doorway_id}</td>
                              <td>Online</td>
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