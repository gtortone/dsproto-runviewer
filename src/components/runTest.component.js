import React, { Component } from "react";
import { styles } from "../css-common";
import { withStyles } from "@mui/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

class RunTest extends Component {
  constructor(props) {
    super(props);
    this.showNextId = this.showNextId.bind(this);
    this.showPrevId = this.showPrevId.bind(this);

    this.maxId = 10;

    this.state = {
      id: 0,
    };

    this.runset = [
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
  }

  showNextId() {
    var newId = this.state.id + 1;
    this.setState({ id: newId });
  }

  showPrevId() {
    var newId = this.state.id - 1;
    this.setState({ id: newId });
  }

  render() {
    return (
      <Box>
        <Button
          variant="outlined"
          disabled={this.state.id === 0}
          onClick={this.showPrevId}
        >
          Prev
        </Button>
        <Button
          variant="outlined"
          disabled={this.state.id === this.maxId - 1}
          onClick={this.showNextId}
        >
          Next
        </Button>
        <Typography>{this.state.id}</Typography>
        <Typography>{this.runset[this.state.id].description}</Typography>
        <Typography>{this.runset[this.state.id].comment}</Typography>
      </Box>
    );
  }
}

export default withStyles(styles)(RunTest);
