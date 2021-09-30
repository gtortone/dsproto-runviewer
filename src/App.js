import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import { styles } from "./css-common";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { withStyles } from "@mui/styles";

import RunList from "./components/runList.component";
import RunDetails from "./components/runDetails.component";

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
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path={["/", "/runlist"]} component={RunList} />
          <Route path="/run/:id" component={RunDetails} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(App);
