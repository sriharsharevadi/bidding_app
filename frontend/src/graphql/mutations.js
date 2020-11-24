import gql from 'graphql-tag'

const GET_CURRENT_USER = gql`
{
    currentUser {
        firstname
        lastname
    }
}
`

const LOGIN_USER = gql`
mutation tokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
        token
        payload
    }
}
`

const VERIFY_USER = gql`
mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
        payload
    }
}
`

export {
  GET_CURRENT_USER,
  LOGIN_USER,
  VERIFY_USER
}