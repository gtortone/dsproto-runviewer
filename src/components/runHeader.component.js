import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// states
import { viewState } from "../state/atoms"

const RunHeader = () => {

  const view = useRecoilValue(viewState);
  const [title, setTitle] = useState(null)

  useEffect( () => {
    if (view.runNumber)
      setTitle(`SETUP - ${view.setup} / run: ${view.runNumber}`)
    else setTitle(`SETUP - ${view.setup}`)
  }, [view.setup, view.runNumber])

  return (
    <>
    <Box
      sx={{
        width: 4 / 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 1,
        color: "white",
        bgcolor: "primary.dark",
        p: 1,
        m: 1
      }}
    >
      <Typography sx ={{ fontSize: 16}} variant='button'>{title}</Typography>
    </Box>
    </>
  );
}

export default RunHeader;
