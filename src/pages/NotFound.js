import React from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

export default function NotFound() {
  return (
    <Box sx={{ display: 'flex', m: 2, p: 2, flexDirection: "column", justifyContent: "center", }}>
      <Typography variant="button">Page not found</Typography>
      <br/>
      <Typography variant="button">Go to the <NavLink to="/">Homepage</NavLink></Typography>
    </Box>
  )
}
