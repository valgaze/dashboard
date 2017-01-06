import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import SidebarMenu from 'dashboard/components/SidebarMenu';

function Sidebar(props) {
  const {} = props;
  
  return (
    <div className="sidebar col-xs-0 col-md-4 off-md-0">
      <SidebarMenu />
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);