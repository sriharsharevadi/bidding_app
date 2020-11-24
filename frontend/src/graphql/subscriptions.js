import gql from 'graphql-tag'

const ALL_ORDERS_SUB = gql`
subscription{
  onNewOrder{
   order {
     id
    quantity
    type
   }
  }
}
`

export { ALL_ORDERS_SUB}