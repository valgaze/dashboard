import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Appbar from 'dashboard/components/Appbar';
import EventCount from 'dashboard/components/EventCount';
import RawEvents from 'dashboard/components/RawEvents';
import Sidebar from 'dashboard/components/Sidebar';
import SpaceCurrentCountCard from 'dashboard/components/SpaceCurrentCountCard';
import SpaceDetailsCard from 'dashboard/components/SpaceDetailsCard';
import TotalVisitors from 'dashboard/components/TotalVisitors';

function SpaceDetail({
  space
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
                <h1>
                  <Link to="/spaces" className="breadcrumb">Spaces / </Link>
                  {space.name}
                </h1>
                <div className="count-and-detail-section">
                  <div className="row">
                    <div className="col-xs-24 off-xs-0 col-md-12 off-md-0">
                      <SpaceCurrentCountCard />
                    </div>
                    <div className="col-xs-24 off-xs-0 col-md-12 off-md-0">
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
                          <td className="mobile-hide">ID</td>
                          <td>Sensor Status</td>
                        </tr>
                      </thead>
                      <tbody>
                        {space.doorways && space.doorways.map(function(doorway, i) {
                          return (
                            <tr key={doorway.doorway_id}>
                              <td>{doorway.name}</td>
                              <td className="mobile-hide">{doorway.doorway_id}</td>
                              <td>-</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="analytics-section">
                  <EventCount spaceId={space.id} />
                  <TotalVisitors spaceId={space.id} />
                  <RawEvents spaceId={space.id} pageSize={10} />
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