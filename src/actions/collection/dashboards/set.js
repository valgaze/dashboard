export const COLLECTION_DASHBOARDS_SET = 'COLLECTION_DASHBOARDS_SET';

export default function collectionDashboardsSet(dashboards) {
  // XXX: Any reports of type `ANNUAL_SAVINGS` should actually be type `HORIZON_CHART`
  dashboards.forEach(dashboard => {
    dashboard.reportSet.forEach(report => {
      if (report.type === 'ANNUAL_SAVINGS') {
        report.type = 'HORIZON_CHART';
      }
    });
  });
  // segments[0].reportSet.push({
  //   id: 'rpt_xxx',
  //   name: 'Horizon Chart',
  //   type: 'HORIZON_CHART',
  //   settings: {
  //     spaceIds: [
  //       'spc_578610047240634650', // conference room
  //       'spc_578610642626281829', // phone booth
  //       'spc_578609560999166590', // pantry
  //       'spc_578610433024328307', // lounge
  //       // 'spc_578610369350599062', // Office
  //       'spc_578609895201309436', // Office desk area
  //     ],
  //   },
  // });
  return { type: COLLECTION_DASHBOARDS_SET, data: dashboards };
}
