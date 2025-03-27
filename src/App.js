import React from "react";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "./services/Context";
import Notification from "./components/Notification";
import MainComponent from "./components/MainComponent";

function App() {
  return (
    <Provider>
      <Router>
        <div className="App">
          <Notification />
          <main>
            <Header />
            <MainComponent />
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
