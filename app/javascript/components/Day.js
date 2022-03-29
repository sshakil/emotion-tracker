import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import EmotionTracker from "./EmotionTracker";
import Calendar from "./StaticDatePickerLandscape";

export default function Day() {
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
            date = { date }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
