import React, { Component } from "react";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import RunHeader from "./runHeader.component";

class RunDetails extends Component {
  constructor(props) {
    super(props);

    this.showPrevRun = this.showPrevRun.bind(this);
    this.showNextRun = this.showNextRun.bind(this);

    this.state = {
      idnum: this.props.location.state.idnum,
      prevDisable: false,
      nextDisable: false,
    };

    this.runCount = this.props.location.state.runCount;
  }

  showPrevRun() {
    this.setState({ idnum: this.state.idnum + 1 });
  }

  showNextRun() {
    this.setState({ idnum: this.state.idnum - 1 });
  }

  render() {
    const currentRun = this.props.location.state.runSet[this.state.idnum];

    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <RunHeader setup={this.props.location.state.setup} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Card variant="outlined" sx={{ border: 0, mt: 1, display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <CardContent>
                <Typography variant="body2" color="textPrimary" gutterBottom>
                  run number
                </Typography>
                <Typography variant="body1" component="div">
                  <strong>{currentRun.runid}</strong>
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body2" gutterBottom>
                  start time
                </Typography>
                <Typography variant="body1" color="textPrimary" component="div">
                  <strong>{currentRun.starttime}</strong>
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body2" color="textPrimary" gutterBottom>
                  stop time
                </Typography>
                <Typography variant="body1" component="div">
                  <strong>{currentRun.stoptime}</strong>
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body2" color="textPrimary" gutterBottom>
                  duration
                </Typography>
                <Typography variant="body1" component="div">
                  <strong>{currentRun.duration}</strong>
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body2" color="textPrimary" gutterBottom>
                  shifter
                </Typography>
                <Typography variant="body1" component="div">
                  <strong>{currentRun.Shifter}</strong>
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
                  <strong>{currentRun["Run type"]}</strong>
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body2" color="textPrimary" gutterBottom>
                  comment
                </Typography>
                <Typography variant="body1" component="div">
                  <strong>{currentRun["Comment"]}</strong>
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
                  <strong>{currentRun["Light level"]}</strong>
                </Typography>
              </CardContent>
            </Box>
          </Card>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ display: "flex", border: 0, m: 1 }}>
              <Button
                variant="outlined"
                disabled={this.state.idnum === this.runCount - 1}
                onClick={this.showPrevRun}
              >
                <strong>PREV</strong>
              </Button>
            </Box>
            <Box sx={{ display: "flex", border: 0, m: 1 }}>
              <Button
                variant="outlined"
                disabled={this.state.idnum === 0}
                onClick={this.showNextRun}
              >
                <strong>NEXT</strong>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default withStyles(styles)(RunDetails);
