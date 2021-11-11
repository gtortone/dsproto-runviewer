import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const RunHeader = (props) => {
  return (
    <Box
        sx={{
          width: 4/5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "center",
          borderRadius: 1,
          color: "white",
          bgcolor: "primary.dark",
          p: 0.5,
          m: 1
        }}
      >
        <Typography variant='body1'>{'setup - ' + props.setup}</Typography>
      </Box>
  );
}

export default RunHeader;
