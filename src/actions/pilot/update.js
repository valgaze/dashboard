import { core } from '@density-int/client';

export const PILOT_UPDATE = 'PILOT_UPDATE';


export default function pilotUpdate(doorwayId, spaceId) {
  return async (dispatch, getState) => {
    try {
      const response = await core.spaces.events({
        id: spaceId,
        doorway_id: doorwayId, 
        start_time: "2016-09-19",
        end_time: "2019-09-19",
        page_size: "1"
      })
      if (response['total'] > 0) {
        dispatch({ 
        type: PILOT_UPDATE, 
        doorwayId: doorwayId,
        totalEvents: response['total'],
        sinceDate: response['results'][0]['timestamp']
      });  
      }
    } catch (err) {
      return false;
    }
  };
}
