import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import RunBorSection from "./runBorSection.component";
import RunEorSection from "./runEorSection.component";

const RunTabBD = (props) => {
  const bdStart = props.currentRun.start.BD;
  const bdStop = props.currentRun.info.status === 'finished' ? props.currentRun.stop.BD : undefined

  const renderListItem = (name, value) => {
    return (
      <ListItem disablePadding>
        <ListItemText
          sx={{ width: 2 / 5, p: 1, mr: 1, bgcolor: "#eee", borderRadius: 1 }}
          primary={name}
        />
        <ListItemText
          sx={{ width: 3 / 5, p: 1, ml: 1, bgcolor: "#eee", borderRadius: 1 }}
          primary={value}
        />
      </ListItem>
    );
  };

  const renderWaveformInfo = (wf, mod) => {
    return (
      <List
        dense
        sx={{
          ml: 5,
          mr: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderListItem("samples number", wf.samplesNumber)}
        {renderListItem("time window", wf.timeWidth + " " + wf.timeUnit)}
        {renderListItem(
          "post trigger window",
          wf.postTriggerWidth + " " + wf.postTriggerUnit
        )}
        {renderListItem("total buffers", wf.totalBuffers)}
        {renderListItem("almost-full level", wf.almostFullLevel)}
        {mod.selfTriggerPolarity && renderListItem("self trigger polarity", mod.selfTriggerPolarity)}
      </List>
    );
  };

  const renderTriggerSourceInfo = (ts) => {
    var content = [];
    if (ts.signals) {
      content.push(
        <List
          dense
          sx={{
            ml: 5,
            mr: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {ts.signals.map((sig) => renderListItem("signal", sig))}
          {ts.triggerSwRate &&
            renderListItem("trigger software rate", ts.triggerSwRate + " Hz")}
        </List>
      );
    }

    if (ts.couples) {
      content.push(
        <TableContainer sx={{ m: 1 }}>
          <Table sx={{ width: 4 / 5 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 100 }}>{"couple"}</TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  {"logic"}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  {"channel / threshold"}
                </TableCell>
              </TableRow>
            </TableHead>
            {ts.couples.map((c) => (
              <TableBody>
                <TableRow key={c.coupleNumber}>
                  <TableCell component="th" scope="row">
                    {c.coupleNumber}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {c.logic}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {c.channels.map((ch) => (
                      <Box>
                        {ch.number} / {ch.threshold}
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      );
    }

    return content;
  };

  const renderTriggerOutputInfo = (to) => {
    var content = [];
    if (to.signals) {
      content.push(
        <List
          dense
          sx={{
            ml: 5,
            mr: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {to.signals.map((sig) => renderListItem("signal", sig))}
          {to.triggerSwRate &&
            renderListItem("trigger software rate", to.triggerSwRate + " Hz")}
          {to.couplesList &&
            renderListItem(
              "couples list",
              to.couplesList.map((item) => item + " ")
            )}
          {to.couplesLogic && renderListItem("couples logic", to.couplesLogic)}
        </List>
      );
    }
    return content;
  };

  const renderBDTable = (bd) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", m: 2 }}>
        {bd.modules.map((mod) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold">
                {mod.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">Waveform</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderWaveformInfo(mod.waveform, mod)}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">Trigger Source</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderTriggerSourceInfo(mod.triggerSource)}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">Trigger Output</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderTriggerOutputInfo(mod.triggerOutput)}
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
            <TableContainer sx={{ m: 2 }}>
              <Table sx={{ width: 4 / 5 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 100 }}>{"channel"}</TableCell>
                    <TableCell style={{ width: 100 }} align="right">
                      {"threshold"}
                    </TableCell>
                    <TableCell style={{ width: 100 }} align="right">
                      {"DAC offset"}
                    </TableCell>
                    <TableCell style={{ width: 100 }} align="right">
                      {"dynamic range"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mod.channels.map((ch) => (
                    <TableRow key={ch.number}>
                      <TableCell component="th" scope="row">
                        {ch.number}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        {ch.threshold}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        {ch.dacOffset}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        {ch.dynamicRange}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
      <RunBorSection>{bdStart && renderBDTable(bdStart)}</RunBorSection>
      {props.currentRun.info.status === 'finished' && <RunEorSection>{bdStop && renderBDTable(bdStop)}</RunEorSection>}
    </Box>
  );
};

export default RunTabBD;
