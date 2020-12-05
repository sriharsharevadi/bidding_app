import gql from 'graphql-tag'

export const AVAILABLE_ORDERS_QUERY = gql`
query availableOrders {
  availableOrders {
    id
    type
    quantity
    user {
      username
      email
    }
  }
}
`

export const MY_ORDERS_QUERY = gql`
query myOrders {
  me {
    userOrder {
      id
      type
      quantity
      createdAt
    }
  }
}
`
export const MY_BIDS_QUERY = gql`
query myBids {
  myBids {
    id
    price
    accepted
    order {
      id
      type
      quantity
    }
  }
}
`
export const ORDER_DETAILS_QUERY = gql`
query ($orderId: Int!, $req: Boolean) {
  bidsByOrder(orderId: $orderId, req: $req) {
    id
    price
    accepted
    user {
      username
      email
    }
  }
  orderDetails(orderId: $orderId) {
    id
    type
    quantity
    user {
      username
      email
    }
  }
}
`

// export const ORDER_DETAILS_QUERY = gql`
// query ($orderId: Int!) {
//   orderDetails(orderId: $orderId) {
//     id
//     type
//     quantity
//     user {
//       username
//       email
//     }
//     orderBid {
//       id
//       price
//       accepted
//       user {
//         username
//         email
//       }
//     }
//   }
// }
// `