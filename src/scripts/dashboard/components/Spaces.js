import React from 'react';
import {connect} from 'react-redux';

import Appbar from 'dashboard/components/Appbar'
import Sidebar from 'dashboard/components/Sidebar'
import {spacesGet} from 'dashboard/actions/spaces';

function Spaces(props) {
  const {
    jwt,
    fetchSpaces,
    spaces,
  } = props;
  
  var loading;
  if(!spaces) {
    loading = true;
    fetchSpaces(jwt);
  } else {
    loading = false;
    setTimeout(function(){
      fetchSpaces(jwt);
    }, 1000);
  }
  
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
                {loading ? "Loading spaces..." : null}
                <table className="table data-table">
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>ID</td>
                      <td>Current Count</td>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? null : spaces.map(function(space, i) {
                      return (
                        <tr key={space.id}>
                          <td>{space.name}</td>
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
  spaces: state.spaces.results,
  jwt: state.user.jwt
});

const mapDispatchToProps = dispatch => ({
  fetchSpaces: (jwt) => {
    dispatch(spacesGet(jwt))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Spaces);