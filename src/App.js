import React, { Component } from "react";
import { Switch, Route, Link as RouterLink } from "react-router-dom";
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

    return (
      <div>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <Typography className={classes.name} variant="h6">
              Run Viewer
            </Typography>
            <Button
              component={RouterLink}
              to="/runlist"
              color="inherit"
              sx={{ m: 2 }}
            >
              List
            </Button>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path={["/", "/runlist"]} component={RunList} />
          <Route path="/run" component={RunDetails} />
          <Route path="/test" component={RunTest} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(App);
