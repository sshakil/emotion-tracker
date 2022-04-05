import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import EmotionTracker from "./EmotionTracker";
import Calendar from "./StaticDatePickerLandscape";

export default function Day() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Calendar/>
        </Grid>
        {/*<Grid item xs={6}>*/}
        {/*  <EmotionTracker/>*/}
        {/*</Grid>*/}
      </Grid>
    </Box>
  );
}
