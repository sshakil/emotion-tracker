import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import EmotionTracker from "./EmotionTracker";
import Calendar from "./StaticDatePickerLandscape";

export default function Day() {
  const [dateValue, setDateValue] = React.useState();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Calendar
            dateValue = { dateValue }
            setDateValue = { setDateValue }
          />
        </Grid>
        <Grid item xs={6}>
          <EmotionTracker
            dateValue = { dateValue }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
