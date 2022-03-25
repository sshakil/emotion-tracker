import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { StaticDatePicker } from "@mui/lab";
import { isWeekend } from "date-fns";

export default function Calendar() {
  const [value, setValue] = React.useState();

  return (
    <StaticDatePicker
      orientation="portrait"
      openTo="day"
      value={ value }
      shouldDisableDate={ isWeekend }
      onChange={ (newValue) => {
        setValue(newValue);
      } }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}
