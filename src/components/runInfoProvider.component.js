import React, { useEffect, useState } from 'react'
import { useRecoilState } from "recoil";
import { useParams, Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RunDataService from "../services/run.service";

// states
import { viewState } from "../state/atoms"

const RunInfoProvider = (props) => {

  const params = useParams()
  // eslint-disable-next-line no-unused-vars
  const [view, setView] = useRecoilState(viewState);
  const [isLoading, setIsLoading] = useState(true)
  const [found, setFound] = useState(false)
  const baseurl = process.env.REACT_APP_BASEURL;

  // check parameters
  const setup = parseInt(params.setup)
  const run = parseInt(params.run)

  useEffect(() => {
    const getRuns = async () => {
      const response = await RunDataService.getAll(setup);

      response.data.data.forEach(el => {
        if (el.runNumber === run) {
          setFound(true)
          setView((old) => ({
            ...old,
            setup: setup,
            runNumber: run,
            runId: el.id,
            total: response.data.total
          }))
        }
      });
      setIsLoading(false);
    }
    getRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', m: 2, p: 2, flexDirection: "row", justifyContent: "center", }}>
      {isLoading && <CircularProgress />}
      {!isLoading && found && <Navigate to={`${baseurl}/run`} />}
      {!isLoading && !found && <Typography variant="button">Run {run} not found in setup {setup}</Typography>}
    </Box>
  );
};

export default RunInfoProvider;