import * as React from 'react';
import TextField from '@mui/material/TextField';
import { CalendarPicker, StaticDatePicker } from "@mui/lab";
import { isWeekend } from "date-fns";
import { useEffect } from "react";

export default function Calendar(props) {
  const { date, setDate } = props

  return (
    <StaticDatePicker
      orientation="portrait"
      openTo="day"
      value={ date }
      shouldDisableDate={ isWeekend }
      onChange={ (newValue) => {
          // console.log("newValue value - ", newValue)
          setDate(newValue);
        }
      }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}
