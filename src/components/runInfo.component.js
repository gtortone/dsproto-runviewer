import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";

import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import Mail from '@mui/icons-material/Mail';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Share from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import RunDataService from "../services/run.service";
import RunInfoTab from "./runInfoTab.component";
import RunHeader from "./runHeader.component";

// states
import { viewState } from "../state/atoms"

const RunInfo = () => {

  const [view, setView] = useRecoilState(viewState);
  const [id, setId] = useState(view.runId);
  const [currentRun, setCurrentRun] = useState(Object);
  const [openShareDlg, setOpenShareDlg] = useState(false)
  const [runUrl, setRunUrl] = useState(null)
  const baseurl = process.env.REACT_APP_BASEURL;

  const retrieveRun = (setup, id) => {
    RunDataService.getRunById(setup, id)
      .then((response) => {
        setCurrentRun(response.data[0]);
        setView((old) => ({ ...old, runNumber: response.data[0].info.runNumber }));
        setRunUrl(`${window.location.protocol}//${window.location.host}${baseurl}/runs/get/${view.setup}/${response.data[0].info.runNumber}`)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveRun(view.setup, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.setup, id]);

  const showPrevRun = () => {
    setId(id - 1);
  };

  const showNextRun = () => {
    setId(id + 1);
  };

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const renderButtonGroup = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            m: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
          variant="outlined"
        >
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<ArrowBackIos />} disabled={id === 0} onClick={showPrevRun}>
              Previous
            </Button>
            <Button variant="contained" startIcon={<Share />} onClick={() => (setOpenShareDlg(true))}>
              Share
            </Button>
            <Button variant="contained" endIcon={<ArrowForwardIos />} disabled={id === view.total - 1} onClick={showNextRun}>
              Next
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: 5 / 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <RunHeader />
      {renderButtonGroup()}
      <RunInfoTab setup={view.setup} currentRun={currentRun} />
      <Dialog fullWidth={true} open={openShareDlg}>
        <DialogTitle>Share run info</DialogTitle>
        <DialogContent>
          <TextField sx={{ width: '60ch' }} id="outlined-basic" variant="outlined" size="small" value={runUrl} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => { copyTextToClipboard(runUrl); setOpenShareDlg(false) }}
            startIcon={<ContentPasteIcon />}>
            Copy to clipboard
          </Button>
          <Button
            onClick={() => (setOpenShareDlg(false))}
            startIcon={<Mail />}
            href={`mailto:?body=${runUrl}`}
            target="_blank"
          >Send by mail
          </Button>
          <Button
            onClick={() => (setOpenShareDlg(false))}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RunInfo;
