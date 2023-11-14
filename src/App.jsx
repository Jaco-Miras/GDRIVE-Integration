import React from "react";
import GoogleDriveFiles from "./GoogleDriveFiles";
import "./index.css";
import Image from "./GDrive Tests/Test1/Image";
import Image2 from "./GDrive Tests/Test1/Image2";
import Test1 from "./Dropbox/Test1";
import DropboxAuth from "./helpers/Dropbox";
import Test2 from "./Dropbox/Test2";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test2 />} />
        <Route path="/folder/:id/:id2" element={<Test1 />} />
      </Routes>
    </Router>
  );
};

export default App;
