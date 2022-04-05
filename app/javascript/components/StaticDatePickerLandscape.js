import * as React from 'react';
import TextField from '@mui/material/TextField';
import { StaticDatePicker } from "@mui/lab";
import { connect, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchDayIfNotInStore, setSelectedDate } from "../actions";

function Calendar(props) {
  const { selectedDate } = props
  const dispatch = useDispatch()

  useEffect(() => {
    console.log("Calender rendered, selectedDate - ", selectedDate)
  }, [props.selectedDate])

  return (
    <StaticDatePicker
      orientation="portrait"
      openTo="day"
      value={ new Date(selectedDate) }
      onChange={ (newSelectedDate) => {
          //todo - these strips timezone info, which will be added back later
          // const date = newValue.toISOString().split('T')[0] - this one has a day ahead issue
          const formattedDate = newSelectedDate.toLocaleDateString()
          // console.log("StaticDatePicker - onChange - newSelectedDate - ", newSelectedDate, formattedDate)
          dispatch(fetchDayIfNotInStore(newSelectedDate))
          dispatch(setSelectedDate(newSelectedDate));
        }
      }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}

function mapStateToProps (state, ownProps) {
  return {
    selectedDate: state.selectedDate.date
  }
}

export default connect(mapStateToProps)(Calendar)
