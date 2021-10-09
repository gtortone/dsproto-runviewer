import React from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const RunHeader = (props) => {
  return (
    <div>
      <Box mt={1}>
        <Chip
          size="small"
          label={props.setup}
          color="primary"
          variant="outlined"
        />
      </Box>
    </div>
  );
}

export default RunHeader;
