import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import BarChartIcon from "@mui/icons-material/BarChart";

import RunBorSection from "./runBorSection.component";
import RunEorSection from "./runEorSection.component";
import historyURL from "../utils/mhistory";

const RunTabHV = (props) => {
  const hvStart = props.currentRun.start.HV;
  const hvStop =
    props.currentRun.status === "finished"
      ? props.currentRun.stop.HV
      : undefined;

  const renderHVTable = (hv) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", m: 2 }}>
        <Button
          href={historyURL(
            props.setup,
            "Voltages",
            "HV",
            props.currentRun.info.startTimestamp,
            props.currentRun.info.stopTimestamp
          )}
          target="_blank"
          variant="contained"
          endIcon={<BarChartIcon />}
        >
          History Plot
        </Button>
        {hv.modules.map((mod) => (
          <TableContainer sx={{ m: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ m: 1 }}>
              {mod.name} - {mod.description}
            </Typography>
            <Table sx={{ width: 4.5 / 5 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 100 }}>{"channel name"}</TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"Vset"}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"Vmon"}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"Iset"}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"Imon"}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"status"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mod.channels.map((ch) => (
                  <TableRow key={ch.name}>
                    <TableCell component="th" scope="row">
                      {ch.name}
                    </TableCell>
                    {ch.metrics.map((m) => (
                      <TableCell align="right">
                        {typeof m.value == "number"
                          ? parseFloat(m.value).toFixed(2)
                          : m.value}{" "}
                        {m.unit}
                      </TableCell>
                    ))}
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
      <RunBorSection>{hvStart && renderHVTable(hvStart)}</RunBorSection>
      {props.currentRun.info.status === "finished" && (
        <RunEorSection>{hvStop && renderHVTable(hvStop)}</RunEorSection>
      )}
    </Box>
  );
};

export default RunTabHV;
