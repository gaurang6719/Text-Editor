import React, { useState } from "react";
import "./App.css";
import ExampleEditor from "./components/ExampleEditor";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <ExampleEditor />
    </>
  );
};
export default App;
