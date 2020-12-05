import client from '../../graphql/graphql'
import {CREATE_BID} from '../../graphql/mutations'
import {ADD_BID,ALL_BIDS, BIDS_FROM_ORDER,ORDER_DETAILS} from '../actionTypes'
import {fetchOrders} from './orderActions'
import {MY_BIDS_QUERY} from '../../graphql/queries'

const error = (payload) => ({type: "ERROR", payload})
const addBid = (payload) => ({ type: ADD_BID, payload})
const allBids = (payload) => ({ type: ALL_BIDS, payload})

export const createBid = (bidInfo) => dispatch => {
  // console.log(bidInfo)
  client.mutate({
    mutation: CREATE_BID,
    variables: {
        price: bidInfo.price,
        orderId: bidInfo.orderId
    },
  })
  .then(req => {
    // console.log(req)
      dispatch(addBid(req.data.createBid))
      fetchOrders()(dispatch)
  })
  .catch(err => { 
    // console.log( err)
    // dispatch(error([err.toString()]))
  })
}

export const fetchBids = () => dispatch => {
  client.query({
      query: MY_BIDS_QUERY
  })
  .then(res => {
      dispatch(allBids(res.data.myBids))    
  })
}
