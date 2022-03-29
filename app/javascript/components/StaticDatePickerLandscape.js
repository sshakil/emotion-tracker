import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { StaticDatePicker } from "@mui/lab";
import { isWeekend } from "date-fns";

export default function Calendar(props) {
  const { dateValue, setDateValue } = props

  return (
    <StaticDatePicker
      orientation="portrait"
      openTo="day"
      value={ dateValue }
      shouldDisableDate={ isWeekend }
      onChange={ (newValue) => {
        console.log("current value - ", dateValue)
        console.log("newValue value - ", newValue)
        setDateValue(newValue);
      } }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}
