import React, { Component } from "react";
import { Switch, Route, Redirect, Link as RouterLink } from "react-router-dom";
import "./App.css";
import { styles } from "./css-common";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { withStyles } from "@mui/styles";

import RunList from "./components/runList.component";
import RunDetails from "./components/runDetails.component";
import RunTest from "./components/runTest.component";

class App extends Component {
  
  render() {
    const { classes } = this.props;
    const baseurl = process.env.REACT_APP_BASEURL;

    return (
      <div>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <Typography className={classes.name} variant="h6">
              Run Viewer
            </Typography>
            <Button
              component={RouterLink}
              to={{
                pathname: baseurl + "/runlist/setup-1",
              }}
              color="inherit"
              sx={{ m: 2 }}
            >
              Setup-1
            </Button>
            <Button
              component={RouterLink}
              to={{
                pathname: baseurl + "/runlist/setup-2",
              }}
              color="inherit"
              sx={{ m: 2 }}
            >
              Setup-2
            </Button>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/">
            <Redirect to="/runlist/setup-1" />
          </Route>
          <Route path={baseurl + "/runlist/:setup"} component={RunList} />
          <Route path={baseurl + "/run"} component={RunDetails} />
          <Route path={baseurl + "/test"} component={RunTest} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(App);
