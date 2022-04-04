import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import EmotionTracker from "./EmotionTracker";
import Calendar from "./StaticDatePickerLandscape";
import { useEffect } from "react";

export default function Day() {
  //todo - this strips timezone info, which will be added back later
  const todaysDate = new Date()
  const [date, setDate] = React.useState(todaysDate);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Calendar
            date = { date }
            setDate = { setDate }
          />
        </Grid>
        <Grid item xs={6}>
          <EmotionTracker
            selectedDate = { date }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
