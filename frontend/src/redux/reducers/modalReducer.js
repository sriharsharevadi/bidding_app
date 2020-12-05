import { HIDE_MODAL, SHOW_MODAL } from "../actionTypes";

const defaultState = {
    modalType: null,
    modalPropsid: null
  }
  
const modalReducer = (state = defaultState, action) => {   
  //   console.log(state, action) 
  switch (action.type) {
    case SHOW_MODAL:
      return {
        modalType: action.payload.__typename,
        modalPropsid: action.payload.id
      }
    case HIDE_MODAL:
      return defaultState
    default:
      return state
    }
  }

  export default modalReducer