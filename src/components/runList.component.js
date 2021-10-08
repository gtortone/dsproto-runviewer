import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import RunDataService from "../services/run.service";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import { random } from "mathjs";

import RunHeader from "./runHeader.component";

const RunList = (props) => {
  const [runset, setRunset] = useState([]);
  const [pageSize, setPageSize] = useState(15);

  let columns = [
    {
      field: "runid",
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
    { field: "Shifter", headerName: "shifter", width: 150 },
    { field: "Run type", headerName: "run type", width: 250 },
    { field: "starttime", headerName: "start time", width: 200 },
    { field: "duration", headerName: "duration", width: 150 },
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
      <RunHeader setup={props.setup} />
      <Box
        key={random()}
        mt={1}
        sx={{
          height: 600,
          width: "70%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <DataGrid
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

export default withStyles(styles)(RunList);
