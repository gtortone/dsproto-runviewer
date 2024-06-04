import React, { useState } from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LinearProgress from "@mui/material/LinearProgress";

import RunTabRI from "./runTabRI.component";
import RunTabHV from "./runTabHV.component";
import RunTabSM from "./runTabSM.component";
import RunTabBD from "./runTabBD.component";
import RunTabDT from "./runTabDT.component";
import RunTabCM from "./runTabCM.component";
import RunTabIN from "./runTabIN.component";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RunInfoTab = (props) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (Object.keys(props.currentRun).length === 0) {
    return <LinearProgress />;
  }

  return (
    <Box mt={1}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        <Tab value={0} label="Info" />
        {props.currentRun.start.HV && <Tab value={1} label="Power" />}
        {props.currentRun.start.SM && <Tab value={2} label="Steering Module" />}
        {props.currentRun.start.CM && <Tab value={3} label="Control Module" />}
        {props.currentRun.start.BD && <Tab value={4} label="Digitizers" />}
        {props.currentRun.start.DT && <Tab value={5} label="Dewar" />}
        {props.currentRun.start.IN && <Tab value={6} label="Instruments" />}
      </Tabs>
      <TabPanel value={value} index={0}>
        <RunTabRI setup={props.setup} currentRun={props.currentRun} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RunTabHV setup={props.setup} currentRun={props.currentRun} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RunTabSM setup={props.setup} currentRun={props.currentRun} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <RunTabCM setup={props.setup} currentRun={props.currentRun} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <RunTabBD setup={props.setup} currentRun={props.currentRun} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <RunTabDT setup={props.setup} currentRun={props.currentRun} />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <RunTabIN setup={props.setup} currentRun={props.currentRun} />
      </TabPanel>
    </Box>
  );
};

export default RunInfoTab;
