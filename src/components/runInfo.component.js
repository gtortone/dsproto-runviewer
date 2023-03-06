import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";

import RunDataService from "../services/run.service";
import RunInfoTab from "./runInfoTab.component";

const RunInfo = (props) => {
  const [id, setId] = useState(props.location.state.id);
  const [currentRun, setCurrentRun] = useState(Object);
  let setup = props.location.state.setup;
  let count = props.location.state.count;

  const retrieveRun = (setup, id) => {
    RunDataService.getRunById(setup, id)
      .then((response) => {
        setCurrentRun(response.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveRun(setup, id);
  }, [setup, id]);

  const showPrevRun = () => {
    let newId = id - 1;
    setId(newId);
  };

  const showNextRun = () => {
    let newId = id + 1;
    setId(newId);
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
            disabled={id === 0}
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
            disabled={id === count-1}
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
      {renderButtonGroup()}
      <RunInfoTab setup={setup} currentRun={currentRun}/>
    </Box>
  );
};

export default RunInfo;
