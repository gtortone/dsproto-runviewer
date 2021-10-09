import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";

import AppToolBar from "./components/appToolBar.component";
import RunList from "./components/runList.component";
import RunDetails from "./components/runDetails.component";
import RunTest from "./components/runTest.component";

const App = (props) => {
  const [setup, setSetup] = useState("setup-1");
  const baseurl = process.env.REACT_APP_BASEURL;

  const changeSetup = (newSetup) => {
    setSetup(newSetup);
  };

  return (
    <div>
      <AppToolBar changeSetup={changeSetup} />
      <Switch>
        <Route exact path={baseurl === "" ? "/" : baseurl}>
          <Redirect to={baseurl + "/runlist"} setup={"setup-1"} />
        </Route>
        <Route path={baseurl + "/runlist"}>
          <RunList setup={setup} />
        </Route>
        <Route path={baseurl + "/run"} component={RunDetails} />
        <Route path={baseurl + "/test"}>
          <RunTest setup={setup} />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
