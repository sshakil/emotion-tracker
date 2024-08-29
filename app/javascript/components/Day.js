import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Typography } from "@mui/material";
import EmotionTracker from "./EmotionTracker"
import Calendar from "./StaticDatePickerLandscape"
import "./styles/EmotionTracker.css"

export default function Day() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Typography
            className="heading"
            variant="h4"
            align="center"
            gutterBottom
          >
            Emotion Tracker
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Calendar/>
        </Grid>

        <Grid item xs={6}>
          <EmotionTracker/>
        </Grid>
      </Grid>
    </Box>
  )
}
