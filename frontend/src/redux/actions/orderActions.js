import { ADD_ORDER,ALL_ORDERS, ORDER_DETAILS, ALL_BIDS, MY_ORDERS } from "../actionTypes";
import client from '../../graphql/graphql';
import {ORDER_DETAILS_QUERY} from '../../graphql/queries'
import {ALL_ORDERS_SUB} from '../../graphql/subscriptions'
import {CREATE_ORDER} from '../../graphql/mutations'


const allOrders = (payload) => ({ type: ALL_ORDERS, payload})
const myOrders = (payload) => ({ type: MY_ORDERS, payload})

const orderDetails = (payload) => ({ type: ORDER_DETAILS, payload})
const allBids = (payload) => ({ type: ALL_BIDS, payload})
const error = (payload) => ({type: "ERROR", payload})
const addOrder = (payload) => ({ type: ADD_ORDER, payload})



export const fetchOrders = (query) => dispatch => {
    // console.log('fetching')
    client.query({
        query: query,
    })
    .then(res => {
        // console.log(res.data)
        if (res.data.availableOrders){
            dispatch(allOrders(res.data.availableOrders))
        }
        else{
            dispatch(myOrders(res.data.me.userOrder))
        }
        
    })
}


export const refreshOrders = (model, query) => dispatch => {
    client.subscribe({
        query: ALL_ORDERS_SUB,
        variables:{
            model: model
        }
    })
    .subscribe(res => {
        // console.log(res.data)
        if (res.data.refresh.model === "orders"){
            fetchOrders(query)(dispatch)
        }
    })
}

export const fetchOrderDetails = (orderId, req) => dispatch => {
    console.log('fetching', orderId)
    client.query({
        query: ORDER_DETAILS_QUERY,
        variables:{
            orderId: orderId,
            req: req
        }
    })
    .then(res => {
        console.log(res.data)
        dispatch(orderDetails(res.data.orderDetails))
        dispatch(allBids(res.data.bidsByOrder))

    })
}

export const createOrder = (orderInfo) => dispatch => {
  // console.log(bidInfo)
  client.mutate({
    mutation: CREATE_ORDER,
    variables: {
        type: orderInfo.type,
        quantity: orderInfo.quantity
    },
  })
  .then(req => {
      dispatch(addOrder(req.data.createOrder))
  })
  .catch(err => { 
    // console.log( err)
    dispatch(error([err.toString()]))
})
}



// export function refreshOrders = () => dispatch => {
//     client.subscribe({
//         subscribe: ALL_ORDERS_SUB,
//     })
//     .subscribe(data => {
//         console.log(data.allOrders)
//         dispatch(allOrders(data.allOrders))
//     })
// }


