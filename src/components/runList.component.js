import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import RunDataService from "../services/run.service";
import { makeStyles } from "@material-ui/core";

import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import { random } from "mathjs";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDataGrid-renderingZone": {
      "& .MuiDataGrid-row": {
        "&:nth-child(2n)": {
          backgroundColor: "rgba(235, 235, 235, .7)",
        },
      },
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none",
    },
  },
}));

const RunList = (props) => {
  const [runset, setRunset] = useState([]);
  const [pageSize, setPageSize] = useState(15);
  const classes = useStyles();

  let columns = [
    {
      field: "runNumber",
      headerName: "run #",
      width: 120,
      renderCell: (params) => {
        // params: GridRowParams
        const newTo = {
          pathname: process.env.REACT_APP_BASEURL + "/run",
          state: {
            runSet: params.api.state.rows.idRowsLookup,
            runCount: Object.keys(params.api.state.rows.idRowsLookup).length,
            idnum: params.row.id,
            setup: props.setup,
          },
        };
        return (
          <Link to={newTo} component={RouterLink}>
            <strong>{params.value}</strong>
          </Link>
        );
      },
    },
    { field: "shifter", headerName: "shifter", width: 150 },
    { field: "runType", headerName: "run type", width: 250 },
    { field: "startTime", headerName: "start time", width: 200 },
    { field: "startTimestamp", hide: true },
    { field: "stopTimestamp", hide: true },
    { field: "duration", headerName: "duration", width: 120},
    {
      field: "writeData",
      headerName: "on disk",
      width: 120,
      renderCell: (params) => {
        let icon = ''
        let color = ''
        if (params.value) {
          icon = 'check_circle'
          color = 'success'
        }
        else {
          color = 'action'
          icon = 'cancel'
        }
        return <Icon color={color} sx={{outlined: true}}>{icon}</Icon>;
      },
    },
    {
      field: "loopCounter",
      headerName: "seq",
      width: 120,
      renderCell: (params) => {
        let label = "-";
        if (params.value !== undefined)
          label = `${params.value}/${params.row["loopLimit"]}`;
        return <div>{label}</div>;
      },
    },
    { field: "loopLimit", hide: true },
    {
      field: "status",
      headerName: "status",
      width: 150,
      renderCell: (params) => {
        // params: GridRowParams
        let chipColor = "";
        if (params.value === "in progress") chipColor = "warning";
        else if (params.value === "finished") chipColor = "success";
        else if (params.value === "aborted") chipColor = "error";

        return <Chip size="small" label={params.value} color={chipColor} />;
      },
    },
    { field: "eventsSent", headerName: "events", width: 150 },
  ];

  const retrieveRunset = (setup) => {
    RunDataService.getAll(setup)
      .then((response) => {
        setRunset(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveRunset(props.setup);
  }, [props.setup]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        key={random()}
        mt={1}
        sx={{
          height: 600,
          width: 4/5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center"
        }}
      >
        <DataGrid
        sx = {{
          width: 5/5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
          className={classes.root}
          autoHeight
          rowHeight={32}
          rows={runset}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 15, 20]}
          pagination
          disableColumnMenu
          disableSelectionOnClick
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
          }}
        />
      </Box>
    </Box>
  );
};

export default RunList;
