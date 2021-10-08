import React, { useState } from "react";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import RunHeader from "./runHeader.component";

const RunDetails = (props) => {
  const [id, setId] = useState(props.location.state.idnum);

  let runCount = props.location.state.runCount;
  const currentRun = props.location.state.runSet[id];

  const showPrevRun = () => {
    let newId = id + 1;
    setId(newId);
  };

  const showNextRun = () => {
    let newId = id - 1;
    setId(newId);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <RunHeader setup={props.location.state.setup} />
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
              disabled={id === runCount - 1}
              onClick={showPrevRun}
            >
              <strong>PREV</strong>
            </Button>
          </Box>
          <Box sx={{ display: "flex", border: 0, m: 1 }}>
            <Button
              variant="outlined"
              disabled={id === 0}
              onClick={showNextRun}
            >
              <strong>NEXT</strong>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(RunDetails);
