import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import getIPAddress from "./utils/getIPAddress";
import { getAuthToken } from "./utils/auth";
import store from "./app/store";
import "./styles/index.scss";
import App from "./App";
let ipAddress = "";

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const token = getAuthToken();
  if (!ipAddress) {
    const { IPv4 } = await getIPAddress();
    ipAddress = IPv4;
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "x-forwarded-for": ipAddress,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>
);
