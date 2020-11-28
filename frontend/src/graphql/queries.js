import gql from 'graphql-tag'

export const ALL_ORDERS = gql`
query allOrders{
  allOrders {
    id
    type
    quantity
  }
}
`

export const MY_ORDERS = gql`
query myOrders{
  me {
    userOrder {
      id
      type
      quantity
      orderBid {
        id
        price
        accepted
      }
    }
  }
}
`
export const BIDS_FROM_ORDER = gql`
query bidsFromOrder($orderID: Int!) {
  bidsByOrder(orderId: $orderID) {
    id
    price
    accepted
    user {
      username
    }
  }
}
`