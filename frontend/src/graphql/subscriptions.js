import gql from 'graphql-tag'

const ALL_ORDERS_SUB = gql`
subscription ($model: String!){
  refresh(model: $model) {
    model
  }
}
`

export { ALL_ORDERS_SUB}