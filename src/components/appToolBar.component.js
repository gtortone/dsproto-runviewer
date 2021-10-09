import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "50px",
    "& .MuiToolbar-regular": {
      minHeight: "50px",
    },
  },
}));

const AppToolBar = (props) => {
  const classes = useStyles();
  const baseurl = process.env.REACT_APP_BASEURL;

  return (
    <div>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h6">Run Viewer</Typography>
          <Button
            component={RouterLink}
            to={{
              pathname: baseurl + "/runlist",
            }}
            color="inherit"
            sx={{ m: 2 }}
            onClick={() => props.changeSetup("setup-1")}
          >
            Setup-1
          </Button>
          <Button
            component={RouterLink}
            to={{
              pathname: baseurl + "/runlist",
            }}
            color="inherit"
            sx={{ m: 2 }}
            onClick={() => props.changeSetup("setup-2")}
          >
            Setup-2
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppToolBar;
