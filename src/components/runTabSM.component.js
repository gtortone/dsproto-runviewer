import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import RunBorSection from "./runBorSection.component";
import RunEorSection from "./runEorSection.component";

const RunTabSM = (props) => {
  const smStart = props.currentRun.start.SM;
  const smStop =
    props.currentRun.info.status === "finished"
      ? props.currentRun.stop.SM
      : undefined;

  const renderLineStatus = (value) => {
    if (value) {
      return <Typography sx={{ color: "green" }}>ON</Typography>;
    } else {
      return <Typography sx={{ color: "red" }}>OFF</Typography>;
    }
  };

  const renderSMTable = (sm) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", m: 2 }}>
        {sm.modules.map((mod) => (
          <TableContainer sx={{ m: 1 }}>
            <Table sx={{ width: 4 / 5 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 100 }}>{"channel"}</TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"low voltage"}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"high voltage"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mod.channels.map((ch) => (
                  <TableRow key={ch.number}>
                    <TableCell component="th" scope="row">
                      {ch.number}
                    </TableCell>
                    <TableCell align="right">
                      {renderLineStatus(ch.lowVoltage)}
                    </TableCell>
                    <TableCell align="right">
                      {renderLineStatus(ch.highVoltage)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      </Box>
    );
  };

  return (
    // main container
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        boxShadow: 2,
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      <RunBorSection>{smStart && renderSMTable(smStart)}</RunBorSection>
      {props.currentRun.info.status === "finished" && (
        <RunEorSection>{smStop && renderSMTable(smStop)}</RunEorSection>
      )}
    </Box>
  );
};

export default RunTabSM;
