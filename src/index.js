import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import "./fontawesome";
import "./misc/typography";

//Start components
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

//shared
import { tokenCache } from "./hooks/auth";

export const client = new ApolloClient({
  uri: BASE_URL + "graphql",
  request: operation => {
    if (tokenCache.token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${tokenCache.token}`
        }
      });
    }
  }
});

const target = document.querySelector("#root");
if (target) {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    target
  );
}
