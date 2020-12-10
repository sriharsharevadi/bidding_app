import { ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink, ApolloLink, concat } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const ip = process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : "localhost:8000"

const httpLink = new HttpLink({
  uri: "http://" + ip + "/api/graph", // use https for secure endpoint
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: "ws://" + ip + "/api/graphql/", // use wss for a secure endpoint
  options: {
    // lazy: true,
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  if(localStorage.getItem('token')){
    operation.setContext({
        headers: {
          Authorization: "JWT " +localStorage.getItem('token') || null,
        }    
    });
  }

  return forward(operation);
})

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  mutation:{
    errorPolicy: 'all',
  }
}

// Instantiate client
const client = new ApolloClient({
  link: concat(authMiddleware, link),
  // link,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions

})


// const client = ...

// client.query({
//     query: gql`
//       query {
//   bidsByOrder(orderId: 1) {
//     id
//   }
// }
//     `
//   })
//   .then(result => console.log(result));

//   client.mutate({
//     mutation: LOGIN_USER,
//     variables: {
//         username: 'admin',
//         password: 'admin'
//     },
// })
// .then(result => console.log(result));

// client.subscribe({
//   query: gql`
//     subscription{
//   onNewOrder{
//    order {
//      id
//     quantity
//     type
//    }
//   }
// }`,
//   variables: {}
// }).subscribe({
//   next (data) {
//     console.log(data.data)
//     // Notify your application with the new arrived data
//   }
// });

// export default new ApolloClient({
//   link: concat(authMiddleware, link),
//   cache: new InMemoryCache()
// })
export default client