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
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { v4 } from 'uuid'

import RunBorSection from "./runBorSection.component";
import RunEorSection from "./runEorSection.component";

const RunTabBD = (props) => {
  const bdStart = Array.isArray(props.currentRun.start.BD) ?
    props.currentRun.start.BD : Array(props.currentRun.start.BD);

  const bdStop =
    props.currentRun.info.status === "finished" ?
      (Array.isArray(props.currentRun.stop.BD) ?
        props.currentRun.stop.BD
        : Array(props.currentRun.stop.BD))
      : undefined;

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
    var n = 0;

    bdStart.forEach((board) => n += board.modules.length);

    for (var i=0; i<n; i++)
      newArray.push(i);
    setExpandedAccordions(newArray);
  };

  const renderListItem = (name, value) => {
    return (
      <ListItem disablePadding key={v4()}>
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

  const renderWaveformInfo = (type, wf, mod) => {
    if (type === "V1725B" || type === "DT5751") {
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
          {mod.selfTriggerPolarity &&
            renderListItem("self trigger polarity", mod.selfTriggerPolarity)}
        </List>
      );
    }
    if (type.startsWith("VX274")) {
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
          {renderListItem("pre-trigger samples number", wf.preTriggerSamples)}
          {renderListItem(
            "pre-trigger window",
            wf.preTriggerWidth + " " + wf.preTriggerUnit
          )}
          {renderListItem("trigger delay samples", wf.triggerDelaySamples)}
          {renderListItem(
            "trigger delay window",
            wf.triggerDelayWidth + " " + wf.triggerDelayUnit
          )}
          {wf.testPulsePeriod && renderListItem("test pulse period", wf.testPulsePeriod + " ms")}
        </List>
      );
    }
  };

  const renderTriggerSourceInfo = (type, ts) => {
    var content = [];
    if (type === "V1725B" || type === "DT5751") {
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

      if (type === "V1725B") {
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
      }

      if (type === "DT5751") {
        if (ts.channels) {
          content.push(
            <TableContainer sx={{ m: 1 }}>
              <Table sx={{ width: 4 / 5 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 100 }}>{"channel"}</TableCell>
                    <TableCell style={{ width: 100 }} align="right">
                      {"threshold"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                {ts.channels.map((c) => (
                  <TableBody>
                    <TableRow key={c.channelNumber}>
                      <TableCell component="th" scope="row">
                        {c.channelNumber}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        {c.threshold}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
              </Table>
            </TableContainer>
          );
        }
      }
    }
    if (type.startsWith("VX274")) {
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
          </List>
        );
      }
      if (ts.groups) {
        content.push(
          <TableContainer sx={{ m: 1 }}>
            <Table sx={{ width: 4 / 5 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 100 }}>{"channel"}</TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"threshold"}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"threshold edge"}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {"multiplicity"}
                  </TableCell>
                </TableRow>
              </TableHead>
              {ts.groups.map((group) => (
                <TableBody>
                  {group.channels.map((ch) => (
                    <TableRow key={group.name + ch.number}>
                      <TableCell component="th" scope="row">
                        {group.name + ch.number}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        {ch.threshold}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        {ch.thresholdEdge}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        {group.multiplicity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ))}
            </Table>
          </TableContainer>
        );
      }
    }
    return content;
  };

  const renderTriggerOutputInfo = (type, to) => {
    var content = [];
    if (type === "V1725B" || type === "DT5751") {
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

            {type === "V1725B" && to.couplesList &&
              renderListItem(
                "couples list",
                to.couplesList.map((item) => item + " ")
              )}
            {type === "V1725B" && to.couplesLogic &&
              renderListItem("couples logic", to.couplesLogic)}

            {type === "DT5751" && to.channelsList &&
              renderListItem(
                "channels list",
                to.channelsList.map((item) => item + " ")
              )}
            {type === "DT5751" && to.channelsLogic &&
              renderListItem("channels logic", to.channelsLogic)}
          </List>
        );
      }
    }
    if (type.startsWith("VX274")) {
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
          {renderListItem("trigger out mode", to.mode)}
          {renderListItem("trigger id mode", to.id)}
        </List>
      );
    }
    return content;
  };

  const renderChannelsTable = (type, mod) => {
    if (type === "V1725B") {
      return (
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
      );
    }

    if (type.startsWith("VX274")) {
      return (
        <TableContainer sx={{ m: 2 }}>
          <Table sx={{ width: 4 / 5 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 100 }}>{"channel"}</TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  {"threshold"}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  {"threshold edge"}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  {"threshold width (ns)"}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  {"DAC offset (pct)"}
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
                    {ch.thresholdEdge}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {ch.thresholdWidth}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="right">
                    {ch.dacOffset}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    if (type === "DT5751") {
      return (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  const renderConfig = (type, mod) => {
    if (type.startsWith("VX274")) {
      return (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1">Config</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List
              dense
              sx={{
                ml: 5,
                mr: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {renderListItem("hostname", mod.hostname)}
              {renderListItem("firmware version", mod.fwVersion)}
              {renderListItem("use external clock", mod.useExtClock.toString())}
              {renderListItem("enable DAC", mod.enableDAC.toString())}
              {renderListItem(
                "use relative trigger thresholds",
                mod.useRelativeTrigThreshold.toString()
              )}
              {mod.vgaGain && renderListItem("VGA gain [00...15]", mod.vgaGain[0] + " dB")}
              {mod.vgaGain && renderListItem("VGA gain [16...31]", mod.vgaGain[1] + " dB")}
              {mod.vgaGain && renderListItem("VGA gain [32...47]", mod.vgaGain[2] + " dB")}
              {mod.vgaGain && renderListItem("VGA gain [48...63]", mod.vgaGain[3] + " dB")}
            </List>
          </AccordionDetails>
        </Accordion>
      );
    }

    if (type.startsWith("DT5751")) {
      return (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1">Config</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List
              dense
              sx={{
                ml: 5,
                mr: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {mod.desMode ? renderListItem("DES mode", "enabled") : renderListItem("DES mode", "disabled")}
            </List>
          </AccordionDetails>
        </Accordion>
      );
    }
  };

  const renderModule = (type, mod, index) => {
    return (
      <Accordion onChange={() => accordionClicked(index)} key={index}
        expanded={expandedAccordions.includes(index)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" fontWeight="bold">
            {mod.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderConfig(type, mod)}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">Waveform</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderWaveformInfo(type, mod.waveform, mod)}
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">Trigger Source</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderTriggerSourceInfo(type, mod.triggerSource)}
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">Trigger Output</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderTriggerOutputInfo(type, mod.triggerOutput)}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
        {renderChannelsTable(type, mod)}
      </Accordion>
    );
  }

  const renderBDTable = (bd) => {
    let index = 0;
    return (
      <Box sx={{ display: "flex", flexDirection: "column", m: 2 }}>
        <Box>
          <Button sx={topButtonStyle} onClick={expandAll}>Expand all</Button>
          <Button sx={topButtonStyle} onClick={collapseAll}>Collapse all</Button>
        </Box>
        {bd.map((board) => (
          board.modules.map((mod) => (renderModule(board.type, mod, index++)))
        ))
        }
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
      {props.currentRun.info.status === "finished" && (
        <RunEorSection>{bdStop && renderBDTable(bdStop)}</RunEorSection>
      )}
    </Box>
  );
};

export default RunTabBD;
