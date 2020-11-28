// src/js/reducers/index.js

import { ERROR } from "../actionTypes";

const defaultState = {
  errors: []
};

const errorReducer = (state = defaultState, action) => {
  // console.log(state, action)
  switch(action.type){
      case ERROR:
          // console.log("action", action)
          // return Object.assign({}, state, {
          //     errors: [...action.payload]
          //   });
          return{
            errors: [...action.payload]
          }
      default: return defaultState
  }
}

export default errorReducer