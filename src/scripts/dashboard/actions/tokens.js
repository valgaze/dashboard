import update from 'react-addons-update';
import api from 'dashboard/helpers/api';
import {ACCOUNTS_URL} from 'dashboard/constants';


const SUCCESS = 'tokens/success';

export const token = {
  list() {
    return (dispatch, getState) => {
      let state = getState();
      return api.list(state, '/tokens', ACCOUNTS_URL).then(function(json){
        dispatch({type: SUCCESS, json: json});
      });
    }
  }
}