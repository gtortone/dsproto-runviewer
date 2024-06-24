import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { v4 } from 'uuid'

import RunBorSection from "./runBorSection.component";
import RunEorSection from "./runEorSection.component";


const RunTabIN = (props) => {
  const instrStart = props.currentRun.start.IN;
  const instrStop =
    props.currentRun.info.status === "finished"
      ? props.currentRun.stop.IN
      : undefined;

  const renderLineStatus = (value) => {
    if (value) {
      return <Typography sx={{ color: "green", fontWeight: 'bold' }}>ON</Typography>;
    } else {
      return <Typography sx={{ color: "red", fontWeight: 'bold' }}>OFF</Typography>;
    }
  };

  const PSU = (props) => {
    return (
      <TableContainer sx={{ m: 1 }} key={v4()}>
        <Typography variant="h6" fontWeight="bold" sx={{ m: 1 }}>
          PSU - {props.dev.brand} {props.dev.model}
        </Typography>
        {renderLineStatus(props.dev.output)}
        <Table sx={{ width: 4.5 / 5 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 100 }}>{"channel"}</TableCell>
              <TableCell style={{ width: 100 }}>{"name"}</TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"voltage"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"current"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Vset"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Ilimit"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.dev.channels.map((ch, index) => (
              <TableRow key={v4()}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{ch.name}</TableCell>
                <TableCell align="right">
                  {parseFloat(ch.voltage).toFixed(4)} V
                </TableCell>
                <TableCell align="right">
                  {parseFloat(ch.current).toFixed(4)} A
                </TableCell>
                <TableCell align="right">
                  {ch.vset} V
                </TableCell>
                <TableCell align="right">
                  {ch.ilimit} A
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const SMU = (props) => {
    return (
      <TableContainer sx={{ m: 1 }} key={v4()}>
        <Typography variant="h6" fontWeight="bold" sx={{ m: 1 }}>
          SMU - {props.dev.brand} {props.dev.model}
        </Typography>
        {renderLineStatus(props.dev.output)}
        <Table sx={{ width: 4.5 / 5 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 100 }}>{"source function"}</TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"level"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Vlimit"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Ilimit"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={v4()}>
              <TableCell component="th" scope="row">
                {props.dev.source.function}
              </TableCell>
              <TableCell align="right">
                {props.dev.source.level}
              </TableCell>
              <TableCell align="right">
                {props.dev.source.vlimit} V
              </TableCell>
              <TableCell align="right">
                {props.dev.source.ilimit} A
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table sx={{ width: 4.5 / 5 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 100 }}>{"measure function"}</TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"value"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={v4()}>
              <TableCell component="th" scope="row">
                {props.dev.measure.function}
              </TableCell>
              <TableCell align="right">
                {props.dev.measure.value}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const renderShape = (dev) => {
    if (dev.shape === 'SIN') {
      return (
        <Table sx={{ width: 4.5 / 5 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 100 }}>
                {"shape"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"frequency"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Vlow"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Vhigh"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {dev.shape}
              </TableCell>
              <TableCell align="right">
                {dev.frequency} Hz
              </TableCell>
              <TableCell align="right">
                {dev.vlow} V
              </TableCell>
              <TableCell align="right">
                {dev.vhigh} V
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    } else if (dev.shape === 'PULS') {
      return (
        <Table sx={{ width: 4.5 / 5 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 100 }}>
                {"shape"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"frequency"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Vlow"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"Vhigh"}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                {"width"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {dev.shape}
              </TableCell>
              <TableCell align="right">
                {dev.frequency} Hz
              </TableCell>
              <TableCell align="right">
                {dev.vlow} V
              </TableCell>
              <TableCell align="right">
                {dev.vhigh} V
              </TableCell>
              <TableCell align="right">
                {dev.width} s
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    }
  }

  const SGEN = (props) => {
    return (
      <TableContainer sx={{ m: 1 }} key={v4()}>
        <Typography variant="h6" fontWeight="bold" sx={{ m: 1 }}>
          SGEN - {props.dev.brand} {props.dev.model}
        </Typography>
        {renderLineStatus(props.dev.output)}
        {renderShape(props.dev)}
      </TableContainer >
    )
  }

  const renderINTable = (instr) => {

    var deviceList = []
    for (var i = 0; i < instr.length; i++) {
      if (instr[i].type === 'PSU')
        deviceList.push(<PSU dev={instr[i]} key={v4()} />)
      else if (instr[i].type === 'SMU')
        deviceList.push(<SMU dev={instr[i]} key={v4()} />)
      else if (instr[i].type === 'SGEN')
        deviceList.push(<SGEN dev={instr[i]} key={v4()} />)
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", m: 2 }}>
        <div>
          {deviceList}
        </div>
      </Box>
    )
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
      <RunBorSection>{instrStart && renderINTable(instrStart)}</RunBorSection>
      {props.currentRun.info.status === "finished" && (
        <RunEorSection>{instrStop && renderINTable(instrStop)}</RunEorSection>
      )}
    </Box>
  );
};

export default RunTabIN;
