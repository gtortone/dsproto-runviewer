import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import RunDataService from "../services/run.service";
import { styles } from "../css-common";

import { withStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import { random } from "mathjs";

import RunHeader from "./runHeader.component";

class RunList extends Component {
  constructor(props) {
    super(props);
    this.retrieveRunset = this.retrieveRunset.bind(this);
    this.renderRunNumberLink = this.renderRunNumberLink.bind(this);

    this.state = {
      runset: [],
      pageSize: 15,
      setup: this.props.setup,
    };

    this.a = this.state.setup;

    this.columns = [
      {
        field: "runid",
        headerName: "run #",
        width: 120,
        renderCell: this.renderRunNumberLink,
      },
      { field: "Shifter", headerName: "shifter", width: 150 },
      { field: "Run type", headerName: "run type", width: 250 },
      { field: "starttime", headerName: "start time", width: 200 },
      { field: "duration", headerName: "duration", width: 150 },
    ];
  }

  renderRunNumberLink(params) {   // params: GridRowParams
    const newTo = {
      pathname: process.env.REACT_APP_BASEURL + "/run",
      state: {
        runSet: params.api.state.rows.idRowsLookup,
        runCount: Object.keys(params.api.state.rows.idRowsLookup).length,
        idnum: params.row.id,
        setup: this.props.setup
      },
    };
    return (
      <Link to={newTo} component={RouterLink}>
        <strong>{params.value}</strong>
      </Link>
    );
  }

  componentDidMount() {
    this.retrieveRunset();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.setup !== this.props.setup) {
      this.setState({ setup: this.props.setup });
      this.retrieveRunset();
    }
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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <RunHeader setup={this.state.setup} />
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
      </Box>
    );
  }
}

export default withStyles(styles)(RunList);
