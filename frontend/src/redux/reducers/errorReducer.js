import { ERROR } from "../actionTypes";

const defaultState = {
  errors: []
};

const errorReducer = (state = defaultState, action) => {
  // console.log(state, action)
  switch(action.type){
    case ERROR:
      return{
        errors: [...action.payload]
      }
  default: return defaultState
  }
}

export default errorReducer