import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Box from "@mui/material/Box";
import "./App.css";

import AppToolBar from "./components/appToolBar.component";
import RunHeader from "./components/runHeader.component";
import RunList from "./components/runList.component";
import RunInfo from "./components/runInfo.component";
import RunTest from "./components/runTest.component";

const App = (props) => {
  const [setup, setSetup] = useState(1);
  const baseurl = process.env.REACT_APP_BASEURL;

  const changeSetup = (newSetup) => {
    setSetup(newSetup);
  };

  return (
    <Box sx={{
      width: 5/5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignSelf: "center",
    }}>
      <AppToolBar changeSetup={changeSetup} />
      <RunHeader setup={setup} />
      <Switch>
        <Route exact path={baseurl === "" ? "/" : baseurl}>
          <Redirect to={baseurl + "/runlist"} setup={1} />
        </Route>
        <Route path={baseurl + "/runlist"}>
          <RunList setup={setup} />
        </Route>
        <Route path={baseurl + "/run"} component={RunInfo} />
        <Route path={baseurl + "/test"}>
          <RunTest />
        </Route>
        {/* Routes for URL based setup-1 / setup-2 */}
        <Route path={baseurl + "/setup-1"}>
          <RunList setup={1} />
        </Route>
        <Route path={baseurl + "/setup-2"}>
          <RunList setup={2} />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;
