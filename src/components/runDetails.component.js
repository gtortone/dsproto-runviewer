import React, { Component } from "react";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

class RunDetails extends Component {
  constructor(props) {
    super(props);
    this.currentRun = {};
  }

  render() {
    console.log(this.props.location)
    this.currentRun = this.props.location.state.run;

    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Card variant="outlined" sx={{ border: 0, mt: 1, display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                run number
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{this.currentRun.id}</strong>
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                start time
              </Typography>
              <Typography variant="body1" color="textPrimary" component="div">
                <strong>{this.currentRun.starttime}</strong>
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                stop time
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{this.currentRun.stoptime}</strong>
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                duration
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{this.currentRun.duration}</strong>
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                shifter
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{this.currentRun.Shifter}</strong>
              </Typography>
            </CardContent>
          </Box>
        </Card>
        <Card variant="outlined" sx={{ border: 0, mt: 1, display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                run type
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{this.currentRun["Run type"]}</strong>
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                comment
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{this.currentRun["Comment"]}</strong>
              </Typography>
            </CardContent>
          </Box>
        </Card>
        <Card variant="outlined" sx={{ border: 0, mt: 1, display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                light level
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{this.currentRun["Light level"]}</strong>
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </Box>
    );
  }
}

export default withStyles(styles)(RunDetails);
