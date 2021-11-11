import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const RunEorSection = (props) => {
  return (
    <Box
      sx={{
        width: 2 / 5,
        display: "flex",
        flexDirection: "column",
        m: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "white",
          bgcolor: "red",
          display: "flex",
          justifyContent: "center",
          borderRadius: 2,
          m: 1,
        }}
      >
        End of Run
      </Typography>
      {props.children}
    </Box>
  );
};

export default RunEorSection;