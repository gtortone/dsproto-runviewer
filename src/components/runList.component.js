import React, { Component } from "react";
import { Link } from "react-router-dom";
import RunDataService from "../services/run.service";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { GridRowParams } from "@mui/x-data-grid";

class RunList extends Component {
  constructor(props) {
    super(props);
    this.retrieveRunset = this.retrieveRunset.bind(this);

    this.state = {
      runset: [],
    };

    this.columns = [
      {
        field: "id",
        headerName: "run #",
        width: 120,
        renderCell: (params: GridRowParams) => (
          <Link
            to={{
              pathname: "/run",
              state: {
                run: params.row,
                id: params.id
              },
            }}
          >
            <strong>{params.id}</strong>
          </Link>
        ),
      },
      { field: "Shifter", headerName: "shifter", width: 200 },
      { field: "Run type", headerName: "run type", width: 250 },
      { field: "starttime", headerName: "start time", width: 300 },
      { field: "duration", headerName: "duration", width: 200 },
    ];
  }

  componentDidMount() {
    this.retrieveRunset();
  }

  retrieveRunset() {
    RunDataService.getAll()
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
    const { runset } = this.state;

    return (
      <Box
        mt={1}
        sx={{ height: 700, display: "flex", flexDirection: "column" }}
      >
        <DataGrid
          rowHeight={35}
          rows={runset}
          columns={this.columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          pagination
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>
    );
  }
}

export default withStyles(styles)(RunList);
