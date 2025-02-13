import React from "react";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Inbox from "./components/Inbox";
import { Provider } from "./services/Context";
import Notification from "./components/Notification";
import Connections from "./components/Connections";

function App() {
  return (
    <Provider>
      <Router>
        <div className="App">
          <main>
            <Header />
            <Notification />
            <div className="main-content">
              <Routes>
                <Route path="/connections" element={<Connections />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
            <Footer />
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
