import { ADD_ORDER } from "../actionTypes";
import client from '../../graphql/graphql';
import {ALL_ORDERS} from '../../graphql/queries'
import {ALL_ORDERS_SUB} from '../../graphql/subscriptions'


const allOrders = (payload) => ({ type: ADD_ORDER, payload})



// export function addOrder(payload) {
//   return { type: ADD_ORDER, payload };
// }

export const fetchOrders = () => dispatch => {
    client.query({
        query: ALL_ORDERS,

    })
    .then(res => {
        // console.log(data.allOrders)
        dispatch(allOrders(res.data.allOrders))
    })
}


export const refreshOrders = () => dispatch => {
    client.subscribe({
        query: ALL_ORDERS_SUB,
    })
    .subscribe(res => {
        console.log(res.data.onNewOrder)
        dispatch(allOrders(res.data.onNewOrder.order))
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


