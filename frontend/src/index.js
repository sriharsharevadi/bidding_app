import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store'
import appolloClient from './graphql/graphql'
import { ApolloProvider } from "@apollo/react-hooks";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client ={appolloClient}>
      <App />
    </ApolloProvider>
  </Provider>
  ,
  document.getElementById('root')
);

