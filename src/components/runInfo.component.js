import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Typography } from "@material-ui/core";

import RunInfoGeneral from "./runInfoGeneral.component";

const RunInfo = (props) => {
  const [id, setId] = useState(props.location.state.idnum);
  const [currentRun, setCurrentRun] = useState(props.location.state.runSet[id]);

  let runCount = props.location.state.runCount;

  const showPrevRun = () => {
    let newId = id + 1;
    setId(newId);
    setCurrentRun(props.location.state.runSet[id]);
  };

  const showNextRun = () => {
    let newId = id - 1;
    setId(newId);
    setCurrentRun(props.location.state.runSet[id]);
  };

  const renderButtonGroup = () => {
    return (
      <ButtonGroup
        variant="outlined"
        sx={{
          m: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{ width: 1 / 5 }}
          disabled={id === runCount - 1}
          onClick={showPrevRun}
        >
          <Typography variant="h7">Previous run</Typography>
        </Button>
        <Button sx={{ width: 1 / 5 }} disabled={id === 0} onClick={showNextRun}>
          <Typography variant="h7">Next run</Typography>
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {renderButtonGroup()}
      <RunInfoGeneral currentRun={currentRun} />
    </Box>
  );
};

export default RunInfo;
