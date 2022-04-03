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
      onChange={ (newValue) => {
          //todo - this strips timezone info, which will be added back later
          const date = newValue.toISOString().split('T')[0]
          console.log("Day selected - ", date)
          setDate(date);
        }
      }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}
