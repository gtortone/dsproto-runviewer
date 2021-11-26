import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import RunDataService from "../services/run.service";
import { makeStyles } from "@material-ui/core";

import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  useGridSlotComponentProps,
} from "@mui/x-data-grid";
import TablePagination from "@mui/material/TablePagination";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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

const useStyles2 = makeStyles({
  menuItem: {
    margin: 2,
    padding: 2,
  },
});

const RunList = (props) => {
  const [runset, setRunset] = useState([]);
  // pageSize state
  const defaultPageSize = 15;
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem("pageSize");
    const initialValue = JSON.parse(saved);
    return initialValue || defaultPageSize;
  });
  // sortModel state
  const defaultSortModel = [
    {
      field: "runNumber",
      sort: "desc",
    },
  ];
  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem("sortModel");
    const initialValue = JSON.parse(saved);
    return initialValue || defaultSortModel;
  });
  // page state
  const defaultPage = { setup: props.setup, number: 0 };
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem("page");
    const initialValue = JSON.parse(saved);
    return initialValue || defaultPage;
  });
  // filter state
  const defaultFilter = { items: [] };
  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("filter");
    const initialValue = JSON.parse(saved);
    return initialValue || defaultFilter;
  });
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
    { field: "runType", headerName: "run type", width: 200 },
    {
      field: "startTime",
      headerName: "start time",
      width: 200,
      filterable: false,
    },
    {
      field: "duration",
      headerName: "duration",
      align: "right",
      width: 120,
      filterable: false,
    },
    {
      field: "writeData",
      headerName: "on disk",
      width: 120,
      align: "center",
      renderCell: (params) => {
        let icon = "";
        let color = "";
        if (params.value) {
          icon = "check_circle";
          color = "success";
        } else {
          color = "action";
          icon = "cancel";
        }
        return (
          <Icon color={color} sx={{ outlined: true }}>
            {icon}
          </Icon>
        );
      },
      filterable: false,
    },
    {
      field: "loopCounter",
      headerName: "seq",
      width: 80,
      renderCell: (params) => {
        let label = "-";
        if (params.value !== undefined)
          label = `${params.value}/${params.row["loopLimit"]}`;
        return <div>{label}</div>;
      },
      filterable: false,
    },
    { field: "loopLimit", hide: true, filterable: false },
    {
      field: "status",
      headerName: "status",
      width: 120,
      renderCell: (params) => {
        // params: GridRowParams
        let chipColor = "";
        if (params.value === "in progress") chipColor = "warning";
        else if (params.value === "finished") chipColor = "success";
        else if (params.value === "aborted") chipColor = "error";
        return <Chip size="small" label={params.value} color={chipColor} />;
      },
      filterable: false,
    },
    {
      field: "channelsNum",
      headerName: "channels",
      type: "number",
      width: 120,
    },
    {
      field: "eventsSent",
      headerName: "events",
      align: "right",
      width: 120,
      filterable: false,
    },
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
    const savedPage = JSON.parse(localStorage.getItem("page"));
    if (savedPage && savedPage.setup !== props.setup) {
      const p = { setup: props.setup, number: 0 };
      setPage(p);
      localStorage.setItem("page", JSON.stringify(p));
    }
  }, [props.setup]);

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <Button sx={{ m: 0, p: 0 }}>
          <Icon sx={{ fontSize: "20px", outlined: true, mr: 0.25 }}>
            refresh
          </Icon>
          <Typography sx={{ ml: 0.5, p: 0, fontSize: 13 }} onClick={resetView}>
            Reset view
          </Typography>
        </Button>
      </GridToolbarContainer>
    );
  };

  const CustomPagination = () => {
    const { state, apiRef, options } = useGridSlotComponentProps();
    const classes = useStyles2();
    if (state.pagination.rowCount === 0) {
      return <div></div>;
    }
    return (
      <TablePagination
        classes={{ menuItem: classes.menuItem }}
        component="div"
        count={state.pagination.rowCount}
        page={options.page}
        onPageChange={(event, value) => changePage(apiRef, value)}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[10, 15, 20]}
        showFirstButton
        showLastButton
        onRowsPerPageChange={(event) => {
          changePageSize(event);
        }}
      />
    );
  };

  const resetView = () => {
    setPage(defaultPage);
    setFilter(defaultFilter);
    setSortModel(defaultSortModel);
    localStorage.setItem("page", JSON.stringify(defaultPage));
    localStorage.setItem("filter", JSON.stringify(defaultFilter));
    localStorage.setItem("sortModel", JSON.stringify(defaultSortModel));
  };

  const changePageSize = (event) => {
    setPageSize(event.target.value);
    localStorage.setItem("pageSize", event.target.value);
    setPage(0);
  };

  const changeOrder = (newModel) => {
    if (JSON.stringify(sortModel[0]) !== JSON.stringify(newModel[0])) {
      setSortModel(newModel);
      localStorage.setItem("sortModel", JSON.stringify(newModel));
    }
  };

  const changePage = (apiRef, newPage) => {
    const p = { setup: props.setup, number: newPage };
    setPage(p);
    localStorage.setItem("page", JSON.stringify(p));
  };

  const changeFilter = (filter) => {
    setFilter(filter);
    localStorage.setItem("filter", JSON.stringify(filter));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        mt={1}
        sx={{
          width: 4 / 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <DataGrid
          sx={{
            width: 5 / 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          components={{
            Toolbar: CustomToolbar,
            Pagination: CustomPagination,
          }}
          className={classes.root}
          page={page.number}
          autoHeight
          rowHeight={32}
          rows={runset}
          columns={columns}
          pagination
          disableColumnMenu
          disableSelectionOnClick
          pageSize={pageSize}
          sortModel={sortModel}
          filterModel={filter}
          onFilterModelChange={(filter) => changeFilter(filter)}
          onSortModelChange={(model) => changeOrder(model)}
        />
      </Box>
    </Box>
  );
};

export default RunList;
