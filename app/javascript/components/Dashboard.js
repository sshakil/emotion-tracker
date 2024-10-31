import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import EmotionTracker from './EmotionTracker'
import Calendar from './StaticDatePickerLandscape'
import './styles/EmotionTracker.css'

export default function Dashboard() {
  return (
    <Box className="day-container">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Typography variant="h4" align="center" gutterBottom className="heading">
            Emotion Tracker
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Calendar />
        </Grid>
        <Grid item xs={6}>
          <EmotionTracker />
        </Grid>
      </Grid>
    </Box>
  )
}