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
        <Toolbar sx={{ display: "flex", flexDirection: "row", width: 4/5}}>
          <Typography variant="h6" sx={{ display: "flex", justifyContent: "center", width: 0.5/5}}>Run Viewer</Typography>
          <Button
            sx={{ display: "flex", justifyContent: "center", width: 0.5/5, p: 1 }}
            component={RouterLink}
            to={{
              pathname: baseurl + "/runlist",
            }}
            color="inherit"
            onClick={() => props.changeSetup(1)}
          >
            Setup-1
          </Button>
          <Button
            sx={{ display: "flex", justifyContent: "center", width: 0.5/5, p: 1 }}
            component={RouterLink}
            to={{
              pathname: baseurl + "/runlist",
            }}
            color="inherit"
            onClick={() => props.changeSetup(2)}
          >
            Setup-2
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppToolBar;
