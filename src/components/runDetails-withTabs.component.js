import React, { Component } from "react";
import PropTypes from "prop-types";
import RunDataService from "../services/run.service";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

import RunInfo from "./runInfo.component";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

class RunDetails extends Component {
  constructor(props) {
    super(props);

    this.getRun = this.getRun.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);

    this.state = {
      currentRun: {},
      currentTab: "info",
    };
  }

  handleTabChange(event, newValue) {
    this.setState({ currentTab: newValue });
  }

  componentDidMount() {
    this.getRun(this.props.match.params.id);
  }

  getRun(id) {
    RunDataService.get(id)
      .then((response) => {
        this.setState({ currentRun: response.data[0] });
        console.log("Inside RunDataService: ");
        console.log(this.state.currentRun);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log("After RunDataService: ");
    console.log(this.state.currentRun);
  }

  render() {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Tabs value={this.state.currentTab} onChange={this.handleTabChange}>
          <Tab value="info" label="Info" />
          <Tab value="boards" label="Boards" />
          <Tab value="monitoring" label="Monitoring" />
        </Tabs>
        <TabPanel value={this.state.currentTab} index={"info"}>
          {<RunInfo run={this.state.currentRun} />}
        </TabPanel>
      </Box>
    );
  }
}

export default RunDetails;
