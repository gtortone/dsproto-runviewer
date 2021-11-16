import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";

import RunDataService from "../services/run.service";
import RunInfoTab from "./runInfoTab.component";

const RunInfo = (props) => {
  const [id, setId] = useState(props.location.state.idnum);
  const [runId, setRunId] = useState(props.location.state.runSet[id].runNumber);
  const [currentRun, setCurrentRun] = useState(Object);
  let setup = props.location.state.setup;
  let runCount = props.location.state.runCount;

  const retrieveRun = (setup, runNumber) => {
    RunDataService.get(setup, runNumber)
      .then((response) => {
        setCurrentRun(response.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveRun(setup, runId);
  }, [setup, runId]);

  const showPrevRun = () => {
    let newId = id + 1;
    setId(newId);
    setRunId(props.location.state.runSet[newId].runNumber);
  };

  const showNextRun = () => {
    let newId = id - 1;
    setId(newId);
    setRunId(props.location.state.runSet[newId].runNumber);
  };

  const renderButtonGroup = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ButtonGroup
          sx={{
            m: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
          variant="outlined"
        >
          <Button
            sx={{
              width: 0.5 / 5,
              borderRadius: 1,
              border: 1,
              borderColor: "primary.main",
              color: "primary.main",
            }}
            disabled={id === runCount - 1}
            onClick={showPrevRun}
          >
            <Typography variant="button">Previous run</Typography>
          </Button>
          <Button
            sx={{
              width: 0.5 / 5,
              borderRadius: 1,
              border: 1,
              borderColor: "primary.main",
              color: "primary.main",
            }}
            disabled={id === 0}
            onClick={showNextRun}
          >
            <Typography variant="button">Next run</Typography>
          </Button>
        </ButtonGroup>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: 5 / 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 1 / 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "center",
          borderRadius: 1,
          border: 1,
          borderColor: "primary.main",
          color: "primary.main",
          p: 0.5,
        }}
      >
        <Typography variant='body1'>run number: {runId}</Typography>
      </Box>
      {renderButtonGroup()}
      <RunInfoTab setup={setup} currentRun={currentRun}/>
    </Box>
  );
};

export default RunInfo;
