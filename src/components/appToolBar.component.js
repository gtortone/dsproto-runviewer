import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core";

import Box from "@mui/material/Box";
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

const AppBarButton = withStyles(theme => ({
  root: {
    color: 'white'
  }
}))(Button);

const AppToolBar = (props) => {
  const classes = useStyles();
  const baseurl = process.env.REACT_APP_BASEURL;

  return (
    <Box>
      <AppBar className={classes.root} sx={{ display: "flex", flexDirection: "row", width: 5/5}} position="static">
        <Toolbar sx={{ display: "flex", flexDirection: "row", width: 5/5, bgcolor: 'primary.dark'}}>
          <Typography variant="h6" sx={{ display: "flex", justifyContent: "center", width: 0.5/5, color: 'white'}}>Run Viewer</Typography>
          <AppBarButton
            sx={{ display: "flex", justifyContent: "center", width: 0.5/5, p: 1 }}
            component={RouterLink}
            to={{
              pathname: baseurl + "/runlist",
            }}
            color="inherit"
            onClick={() => props.changeSetup(1)}
          >
            Setup-1
          </AppBarButton>
          <AppBarButton
            sx={{ display: "flex", justifyContent: "center", width: 0.5/5, p: 1 }}
            component={RouterLink}
            to={{
              pathname: baseurl + "/runlist",
            }}
            color="inherit"
            onClick={() => props.changeSetup(2)}
          >
            Setup-2
          </AppBarButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppToolBar;
