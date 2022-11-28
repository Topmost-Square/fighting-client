import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
    ApolloClient,
    createHttpLink,
    ApolloLink,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_SERVER,
    credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
    const token = '';
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`
        }
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>
  </React.StrictMode>
);
