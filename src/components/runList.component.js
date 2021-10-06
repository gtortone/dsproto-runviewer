import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import RunDataService from "../services/run.service";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { GridRowParams } from "@mui/x-data-grid";
import Link from "@mui/material/Link";

class RunList extends Component {
  constructor(props) {
    super(props);
    this.retrieveRunset = this.retrieveRunset.bind(this);

    this.state = {
      runset: [],
      pageSize: 15,
      setup: "",
    };

    this.columns = [
      {
        field: "runid",
        headerName: "run #",
        width: 120,
        renderCell: function (params: GridRowParams) {
          return (
            <Link
              component={RouterLink}
              to={{
                pathname: process.env.REACT_APP_BASEURL + "/run",
                state: {
                  runSet: params.api.state.rows.idRowsLookup,
                  runCount: Object.keys(params.api.state.rows.idRowsLookup)
                    .length,
                  idnum: params.row.id,
                },
              }}
            >
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

    // no default state from parent (App)
    this.props.location.state
      ? this.state.setup = this.props.location.state.setup
      : this.state.setup = "setup-1"
  }

  componentDidMount() {
    this.retrieveRunset();
  }

  retrieveRunset() {
    RunDataService.getAll(this.state.setup)
      .then((response) => {
        this.setState({
          runset: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <Box
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
          rows={this.state.runset}
          columns={this.columns}
          pageSize={this.state.pageSize}
          rowsPerPageOptions={[10, 15, 20]}
          pagination
          disableColumnMenu
          disableSelectionOnClick
          onPageSizeChange={(newPageSize) => {
            this.setState({ pageSize: newPageSize });
          }}
        />
      </Box>
    );
  }
}

export default withStyles(styles)(RunList);
