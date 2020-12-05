// src/js/reducers/index.js

import { ADD_BID , ALL_BIDS} from "../actionTypes";

const defaultState = {
  price: "",
  bids: []
};

const bidReducer = (state = defaultState, action) => {
  // console.log(action.type, action.payload)
  switch(action.type){
    case ADD_BID:
      return Object.assign({}, state, {
          price: [action.payload]
        });
    case ALL_BIDS:
      if (action.payload){
        return Object.assign({}, state, {
          bids: [...action.payload]
        });
      }
      else{
        return Object.assign({}, state, {
          bids: action.payload
        });
      } 
    case "HIDE_MODAL":
      // console.log("action", action)
      return defaultState
    default: return state
  }
}

export default bidReducer