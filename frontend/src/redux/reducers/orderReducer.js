import { ADD_ORDER, ORDER_DETAILS, ALL_ORDERS, MY_ORDERS, HIDE_MODAL } from "../actionTypes";

const defaultState = {
  orders: [],
  myOrders:[],
  orderDetails: {},
  order_create: {}
};

const orderReducer = (state = defaultState, action) => {
  // console.log(action.type, action.payload)
  switch(action.type){
    case ALL_ORDERS:
      return Object.assign({}, state, {
          orders: [...action.payload]
        });
    case MY_ORDERS:
      return Object.assign({}, state, {
          myOrders: [...action.payload]
        });
    case ORDER_DETAILS:
      return Object.assign({}, state, {
        orderDetails: action.payload
      });
    case ADD_ORDER:
      return Object.assign({}, state, {
        order_create: action.payload
      });
    case HIDE_MODAL:
      return Object.assign({}, state, {
        order_create: {}
      });
    default: return state
  }
}

export default orderReducer