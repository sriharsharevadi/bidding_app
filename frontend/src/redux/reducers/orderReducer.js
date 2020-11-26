// src/js/reducers/index.js

import { ADD_ORDER } from "../actionTypes";

const defaultState = {
  orders: []
};

const orderReducer = (state = defaultState, action) => {
    switch(action.type){
        case ADD_ORDER:
            // console.log("action", action)
            return Object.assign({}, state, {
                orders: [...action.payload]
              });
        default: return state
    }
}

export default orderReducer