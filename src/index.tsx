import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    ApolloProvider,
    from,
    split
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getToken } from "./utils/auth";
import {store} from "./store";
import {Provider} from "react-redux";

const authServiceLink = createHttpLink({
    uri: process.env.REACT_APP_AUTH_SERVICE,
    credentials: 'include'
});

const dataServiceLink = createHttpLink({
    uri: process.env.REACT_APP_DATA_SERVICE,
    credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`
        }
    }
});

const dataWithAuthLink = from([
    authLink,
    dataServiceLink
]);

const client = new ApolloClient({
    link: split(
        operation => operation.getContext().clientName === 'auth',
        authServiceLink,
        dataWithAuthLink
    ),
    cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
          <BrowserRouter>
              <Provider store={store}>
                  <App />
              </Provider>
          </BrowserRouter>
      </ApolloProvider>
  </React.StrictMode>
);
