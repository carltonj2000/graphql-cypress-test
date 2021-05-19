import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route } from "react-router-dom";

import logo from "./Logo-NBA.png";
import Games from "./components/Games";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
});

function App() {
  return (
    <ApolloProvider {...{ client }}>
      <div>
        <div className="text-lg font-bold m-1 p-1 bg-indigo-100 shadow">
          <p>Home</p>
        </div>
        <Games />
      </div>
    </ApolloProvider>
  );
}

export default App;
