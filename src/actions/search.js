import { SEARCH, SEARCH_SUCCESS, SEARCH_FAILURE } from './ActionTypes';
import axios from 'axios';

export function searchRequest(username) {
  return dispatch => {
    dispatch(search());

    return axios
      .get(`/api/auth/search/${username}`)
      .then(response => {
        dispatch(searchSuccess(response.data));
      })
      .catch(err => {
        dispatch(searchFailure());
      });
  };
}

export function search() {
  return {
    type: SEARCH
  };
}

export function searchSuccess(usernames) {
  return {
    type: SEARCH_SUCCESS,
    usernames
  };
}

export function searchFailure(error) {
  return {
    type: SEARCH_FAILURE,
    error
  };
}
