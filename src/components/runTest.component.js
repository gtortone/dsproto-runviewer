import React, { useState } from "react";
import { styles } from "../css-common";
import { withStyles } from "@mui/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const RunTest = (props) => {

  const [id, setId] = useState(0)
  let maxId = 10
  let runset = [
    { description: "run number one", comment: "very good" },
    { description: "run number two", comment: "very bad" },
    { description: "run number three", comment: "excellent !" },
    { description: "run number four", comment: "not so bad" },
    { description: "run number five", comment: "very good" },
    { description: "run number six", comment: "not so bad" },
    { description: "run number seven", comment: "excellent !" },
    { description: "run number eight", comment: "very good" },
    { description: "run number nine", comment: "not so bad" },
    { description: "run number ten", comment: "excellent !" },
  ];

  const showNextId = () => {
    let newId = id + 1;
    setId(newId);
  }

  const showPrevId = () => {
    let newId = id - 1;
    setId(newId);
  }

  return (
    <Box>
      <Button
        variant="outlined"
        disabled={id === 0}
        onClick={showPrevId}
      >
        Prev
      </Button>
      <Button
        variant="outlined"
        disabled={id === maxId - 1}
        onClick={showNextId}
      >
        Next
      </Button>
      <Typography>{id}</Typography>
      <Typography>{runset[id].description}</Typography>
      <Typography>{runset[id].comment}</Typography>
    </Box>
  );
};

export default withStyles(styles)(RunTest);
