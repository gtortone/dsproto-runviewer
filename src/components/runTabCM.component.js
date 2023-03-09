import React, { useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Accordion from "@mui/material/Accordion";
import Button from "@mui/material/Button"
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import RunBorSection from "./runBorSection.component";
import RunEorSection from "./runEorSection.component";

const RunTabCM = (props) => {
  const cmStart = props.currentRun.start.CM;
  const cmStop =
    props.currentRun.info.status === "finished"
      ? props.currentRun.stop.CM
      : undefined;

  const renderLineStatus = (value) => {
    if (value) {
      return <Typography sx={{ color: "green" }}>ON</Typography>;
    } else {
      return <Typography sx={{ color: "red" }}>OFF</Typography>;
    }
  };

  const topButtonStyle = {
    m: 2,
    p: 0,
    width: 1 / 6,
    borderRadius: 1,
    border: 1,
    borderColor: "primary.main",
    color: "primary.main",
  }

  // first accordion expanded by default
  const [expandedAccordions, setExpandedAccordions] = useState([0]);

  const accordionClicked = (index) => {
    // check if accordion is expanded
    if (expandedAccordions.includes(index))
      // remove index from list else add index to list
      setExpandedAccordions(
        expandedAccordions.filter((number) => number !== index)
      );
    else setExpandedAccordions([...expandedAccordions, index]);
  };

  const collapseAll = () => {
    setExpandedAccordions([]);
  };

  const expandAll = () => {
    const newArray = [];
    const n = cmStart.pdus.length
    for (var i = 0; i < n; i++)
      newArray.push(i);
    setExpandedAccordions(newArray);
  };

  const renderCMTable = (cm) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", m: 2 }}>
        <Box>
          <Button sx={topButtonStyle} onClick={expandAll}>Expand all</Button>
          <Button sx={topButtonStyle} onClick={collapseAll}>Collapse all</Button>
        </Box>
        {cm.pdus.map((pdu, index) => (
          <Accordion onChange={() => accordionClicked(index)}
            expanded={expandedAccordions.includes(index)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold">
                PDU {pdu.number}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer sx={{ m: 1 }}>
                <Table sx={{ width: 4 / 5 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: 100 }}>quadrant</TableCell>
                      <TableCell style={{ width: 100 }}>main</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile1 LV"}</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile1 HV"}</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile2 LV"}</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile2 HV"}</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile3 LV"}</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile3 HV"}</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile4 LV"}</TableCell>
                      <TableCell style={{ width: 100 }}>{"tile4 HV"}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pdu.quadrants.map((q) => (
                      <TableRow key={q.number}>
                        <TableCell component="th" scope="row">
                          {q.number}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.main)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[0].lowVoltage)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[0].highVoltage)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[1].lowVoltage)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[1].highVoltage)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[2].lowVoltage)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[2].highVoltage)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[3].lowVoltage)}
                        </TableCell>
                        <TableCell align="center">
                          {renderLineStatus(q.tiles[3].highVoltage)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
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
      <RunBorSection>{cmStart && renderCMTable(cmStart)}</RunBorSection>
      {props.currentRun.info.status === "finished" && (
        <RunEorSection>{cmStop && renderCMTable(cmStop)}</RunEorSection>
      )}
    </Box>
  );
};

export default RunTabCM;
