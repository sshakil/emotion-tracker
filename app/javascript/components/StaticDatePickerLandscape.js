import * as React from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function StaticDatePickerDemo() {
  const [value, setValue] = React.useState(dayjs());

  // Log the value whenever it changes
  React.useEffect(() => {
    console.log("Valu e updated:", value);
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        orientation="landscape"
        openTo="day"
        value={value}
        onChange={(newValue) => {
          console.log("New date selected:", newValue);
          setValue(newValue);
        }}
        onClick={() => console.log('Date picker clicked')}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}