import React from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import "./App.css";

import AppToolBar from "./components/appToolBar.component";
import RunList from "./components/runList.component";
import RunInfo from "./components/runInfo.component";
import RunInfoProvider from "./components/runInfoProvider.component";

const App = () => {
  const baseurl = process.env.REACT_APP_BASEURL;

  return (
    <Box sx={{
      width: 5/5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignSelf: "center",
    }}>
      <AppToolBar />
      <Routes>
        <Route exact path={baseurl === "" ? "/" : baseurl} element={<RunList/>}/>
        <Route exact path={baseurl + "/run"} element={<RunInfo/>}/>
        <Route path={baseurl + "/run/:setup/:run"} element={<RunInfoProvider/>}/>
      </Routes>
    </Box>
  );
};

export default App;
