import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Report from '../report/index';

import InputBox from '@density/ui-input-box';
import SpaceHierarchySelectBox from '../space-hierarchy-select-box/index';
import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import AppBar from '../app-bar/index';
import AppFrame from '../app-frame/index';
import AppPane from '../app-pane/index';
import AppScrollView from '../app-scroll-view/index';

import filterHierarchy from '../../helpers/filter-hierarchy/index';
import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

function EmptyState({spaceIds}) {
  return (
    <Fragment>
      <h2>Questions:</h2>
      <ul>
        <li>
          <a href={`#/explore-new/${spaceIds.join(',')}/qst_1`}>
            How many people came to lunch?
          </a>
        </li>
      </ul>
    </Fragment>
  );
}

export function NewExploreDetail({
  spaceIds,
  question,
  spaces,
  reports,
  calculatedReportData,

  onSpaceChangeParent,
  onSpaceSearch,
  onReportControlDataChange,
}) {
  // Filter space list
  // 1. Using the space hierarchy `parent value`
  // 2. Using the fuzzy search
  // 3. Only show 'space' type spaces
  let filteredSpaces = spaces.data;
  if (spaces.filters.parent) {
    filteredSpaces = filterHierarchy(filteredSpaces, spaces.filters.parent, {mustBeSpace: false}); /* 1 */
  }
  if (spaces.filters.search) {
    filteredSpaces = spaceFilter(filteredSpaces, spaces.filters.search); /* 2 */
  }
  // filteredSpaces = filteredSpaces.filter(space => space.spaceType === 'space') #<{(| 3 |)}>#

  return (
    <AppFrame>
      <AppPane>
        <AppBar title="Space List" />
        <AppScrollView>
          <div className="explore-new-space-filters">
            <InputBox
              type="text"
              width={250}
              placeholder="Filter Spaces ..."
              value={spaces.filters.search}
              onChange={e => onSpaceSearch(e.target.value)}
            />

            <SpaceHierarchySelectBox
              value={spaces.filters.parent}
              choices={spaces.data.filter(i => i.spaceType !== 'space')}
              onChange={parent => onSpaceChangeParent(parent ? parent.id : null)}
            />
          </div>

          {spaceIds.length === 0 ? (
            <a href={`#/explore-new/${spaces.data.map(s => s.id).join(',')}/${question ? question.id : ''}`}>Select All</a>
          ) : (
            <a href={`#/explore-new`}>Deselect All</a>
          )}

          <ul>
            {filteredSpaces.sort((a, b) => a.name.localeCompare(b.name)).map(space => {
              if (spaceIds.indexOf(space.id) >= 0) {
                return (
                  <li key={space.id}>
                    [{space.spaceType}] {space.name}{' '}
                    <a href={`#/explore-new/${spaceIds.filter(i => i !== space.id).join(',')}/${question ? question.id : ''}`}>(remove)</a>
                  </li>
                );
              } else {
                return (
                  <li key={space.id}>
                    <a href={`#/explore-new/${[...spaceIds, space.id].join(',')}/${question ? question.id : ''}`}>
                      [{space.spaceType}] {space.name}
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </AppScrollView>
      </AppPane>
      <AppPane>
        <AppBar title="Space Data" />
        <div className="explore-new-detail">
          {question ? <Fragment>
            <h1>{question.name}</h1>
            <div>
              <h3>Controls</h3>
              {Object.entries(question.controls).map(([key, control]) => (
                <div key={key}>
                  <label>Label: {control.label}</label>
                  <div>{control.render('foo', value => onReportControlDataChange(key, value))}</div>
                </div>
              ))}
            </div>
          </Fragment> : null}
          {reports.state === 'COMPLETE' && reports.data.length === 0 ? (
            <div>
              <EmptyState spaceIds={spaces.data.map(space => space.id)} />
            </div>
          ) : null}
          {reports.state === 'COMPLETE' && reports.data.length > 0 ? reports.data.map(report => (
            <Report
              key={report.id}
              report={report}
              reportData={calculatedReportData[report.id]}
            />
          )) : null}
          <pre>{JSON.stringify(reports, null, 2)}</pre>
        </div>
      </AppPane>
    </AppFrame>
  );
}

export default connect(state => {
  return {
    spaceIds: state.miscellaneous.exploreSpaceIds,
    question: state.miscellaneous.exploreSpaceQuestion,
    spaces: state.spaces,
    reports: state.exploreData.calculations.reports,
    calculatedReportData: state.dashboards.calculatedReportData,
  };
}, dispatch => {
  return {
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },
    onSpaceChangeParent(parentId) {
      dispatch(collectionSpacesFilter('parent', parentId));
    },
    onReportControlDataChange(key, value) {
      console.log('CHANGING FILTER DATA', key, value);
    },
  };
})(NewExploreDetail);
