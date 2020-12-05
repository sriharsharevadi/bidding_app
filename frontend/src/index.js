import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store'
import appolloClient from './graphql/graphql'
import { ApolloProvider } from "@apollo/react-hooks";
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client ={appolloClient}>
      <App />
    </ApolloProvider>
  </Provider>
  ,
  document.getElementById('root')
);

