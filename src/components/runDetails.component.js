import React, { Component } from "react";
import RunDataService from "../services/run.service";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

class RunDetails extends Component {
  constructor(props) {
    super(props);
    this.getRun = this.getRun.bind(this);

    this.state = {
      currentRun: {
        id: null,
      },
      message: "",
    };
  }

  retrieveRunset() {
    RunDataService.getAll()
      .then((response) => {
        this.setState({
          runset: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      })
  }

  componentDidMount() {
    this.getRun(this.props.match.params.id);
  }

  getRun(id) {
    RunDataService.get(id)
      .then((response) => {
        this.setState({
          currentRun: response.data[0],
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentRun } = this.state;

    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Card variant="outlined" sx={{ border: 0, mt: 1, display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent>
              <Typography variant="body2" color="textPrimary" gutterBottom>
                run number
              </Typography>
              <Typography variant="body1" component="div">
                <strong>{currentRun.id}</strong>
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
      </Box>
    );
  }
}

export default withStyles(styles)(RunDetails);
