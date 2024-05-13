import React from "react";
import "./App.css";
import DragnDrop from "./components/DragnDrop";
import data from "./components/data";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DragnDrop data={data} />
      </header>
    </div>
  );
}

export default App;
