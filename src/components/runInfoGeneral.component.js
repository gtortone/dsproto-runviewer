import React from "react";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const RunInfoGeneral = (props) => {
  const renderListItem = (name, value) => {
    return (
      <ListItem disablePadding>
        <ListItemText
          sx={{ width: 1 / 5, p: 1, mr: 1, bgcolor: "#eee", borderRadius: 1 }}
          primary={name}
        />
        <ListItemText
          sx={{ width: 4 / 5, p: 1, ml: 1, bgcolor: "#eee", borderRadius: 1 }}
          primary={value}
        />
      </ListItem>
    );
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: 3 / 5,
          mt: 1,
          display: "flex",
          flexDirection: "column",
          boxShadow: 2,
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ m: 1 }}>
            Run details
          </Typography>
        </Box>
        <List
          dense
          sx={{
            ml: 10,
            mr: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderListItem("run number", props.currentRun.runid)}
          {renderListItem("status", props.currentRun.status)}
          {renderListItem("start time", props.currentRun.starttime)}
          {renderListItem("stop time", props.currentRun.stoptime)}
          {renderListItem("duration", props.currentRun.duration)}
          {renderListItem("shifter", props.currentRun.Shifter)}
          {renderListItem("type", props.currentRun["Run type"])}
          {renderListItem("comment", props.currentRun["Comment"])}
          {renderListItem("light level", props.currentRun["Light level"])}
        </List>
      </Box>
    </Box>
  );
};

export default RunInfoGeneral;
