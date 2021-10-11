import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";

import AppToolBar from "./components/appToolBar.component";
import RunHeader from "./components/runHeader.component";
import RunList from "./components/runList.component";
import RunInfo from "./components/runInfo.component";
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
      <RunHeader setup={setup} />
      <Switch>
        <Route exact path={baseurl === "" ? "/" : baseurl}>
          <Redirect to={baseurl + "/runlist"} setup={"setup-1"} />
        </Route>
        <Route path={baseurl + "/runlist"}>
          <RunList setup={setup} />
        </Route>
        <Route path={baseurl + "/run"} component={RunInfo} />
        <Route path={baseurl + "/test"}>
          <RunTest setup={setup} />
        </Route>
        {/* Routes for URL based setup-1 / setup-2 */}
        <Route path={baseurl + "/setup-1"}>
          <RunList setup={'setup-1'} />
        </Route>
        <Route path={baseurl + "/setup-2"}>
          <RunList setup={'setup-2'} />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
