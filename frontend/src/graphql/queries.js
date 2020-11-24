import gql from 'graphql-tag'

const ALL_ORDERS = gql`
query allOrders{
    allOrders {
      id
      type
      quantity
    }
  }
`

export { ALL_ORDERS}