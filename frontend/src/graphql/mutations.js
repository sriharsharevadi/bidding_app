import gql from 'graphql-tag'

export const GET_CURRENT_USER = gql`
{
    currentUser {
        firstname
        lastname
    }
}
`

export const LOGIN_USER = gql`
mutation tokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
        token
        payload
    }
}
`

export const VERIFY_USER = gql`
mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
        payload
    }
}
`
export const CREATE_USER = gql`
mutation createUser($username: String!, $password: String!, $email: String!) {
  createUser(input: {username: $username, password: $password, email: $email}) {
    id
    username
    errors {
      messages
    }
  }
}
`
export const CREATE_BID = gql`
mutation createUser($orderId: String!, $price: Int!) {
  createBid(orderId: $orderId, price: $price) {
    bid {
      id
      price
    }
  }
}
`