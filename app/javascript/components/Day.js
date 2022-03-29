import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import EmotionTracker from "./EmotionTracker";
import Calendar from "./StaticDatePickerLandscape";
import { useEffect } from "react";

export default function Day() {
  const todaysDate = new Date()
  const [date, setDate] = React.useState(todaysDate);

  useEffect(() => {
    // console.log("date - ", date)
    /*
    * 1. check if current date exists on backend
    *     yes - load it
    *     no - create it
    *
    * 2. when user adds or deletes an emotion from a period
    *
    * */
  })

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
            date = { date }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
