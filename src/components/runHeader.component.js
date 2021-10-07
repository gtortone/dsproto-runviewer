import React, { Component } from "react";
import { styles } from "../css-common";
import { withStyles } from "@mui/styles";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

class RunHeader extends Component {
  render() {
    return (
      <div>
        <Box mt={1}>
          <Chip
            size="small"
            label={this.props.setup}
            color="primary"
            variant="outlined"
          />
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(RunHeader);
